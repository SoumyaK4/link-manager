document.addEventListener('DOMContentLoaded', function () {
    const addLinkPopup = document.getElementById('add-link-popup');
    const showAddLinkPopup = document.getElementById('show-add-link-popup');
    const closeBtns = document.querySelectorAll('.close-btn');
    const cancelLinkBtn = document.getElementById('cancel-link-btn');
    const addLinkForm = document.getElementById('add-link-form');
    const categoriesList = document.getElementById('categories-list');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const links = JSON.parse(localStorage.getItem('links')) || [];

    showAddLinkPopup.addEventListener('click', function () {
        loadCategories();
        addLinkPopup.style.display = 'flex';
    });

    closeBtns.forEach(btn => btn.addEventListener('click', function () {
        btn.parentElement.parentElement.style.display = 'none';
    }));

    cancelLinkBtn.addEventListener('click', function () {
        addLinkPopup.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == addLinkPopup) {
            addLinkPopup.style.display = 'none';
        }
    });

    addLinkForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const id = document.getElementById('link-id').value;
        const category = document.getElementById('category').value;
        const linkName = document.getElementById('link-name').value.trim();
        const linkUrl = document.getElementById('link-url').value.trim();

        if (id) {
            // Update existing link
            const index = links.findIndex(link => link.id === id);
            links[index] = { id, category, linkName, linkUrl };
        } else {
            // Add new link
            links.push({ id: Date.now().toString(), category, linkName, linkUrl });
        }

        localStorage.setItem('links', JSON.stringify(links));
        addLinkPopup.style.display = 'none';
        renderCategories();
    });

    function loadCategories() {
        const categorySelect = document.getElementById('category');
        categorySelect.innerHTML = '';

        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });
    }

    function renderCategories() {
        categoriesList.innerHTML = '';

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-item';
            categoryDiv.innerHTML = `<button class="category-link">${category}</button>`;
            categoriesList.appendChild(categoryDiv);

            const categoryLink = categoryDiv.querySelector('.category-link');
            categoryLink.addEventListener('click', function () {
                showCategoryLinks(category);
            });
        });
    }

    function showCategoryLinks(category) {
        const filteredLinks = links.filter(link => link.category === category);
        categoriesList.innerHTML = '';

        filteredLinks.forEach(link => {
            const linkDiv = document.createElement('div');
            linkDiv.className = 'link-item';
            linkDiv.innerHTML = `<button class="link-copy-btn">${link.linkName}</button>`;
            categoriesList.appendChild(linkDiv);

            const linkCopyBtn = linkDiv.querySelector('.link-copy-btn');
            linkCopyBtn.addEventListener('click', function () {
                const linkHTML = `<a href="${link.linkUrl}" target="_blank">${link.linkName}</a>`;
                navigator.clipboard.writeText(linkHTML);
                // alert('Link copied to clipboard');
            });
        });
    }

    renderCategories();

    // Export data
    document.getElementById('export-data').addEventListener('click', function () {
        const data = {
            categories: categories,
            links: links
        };
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    // Import data
    document.getElementById('import-data').addEventListener('click', function () {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = function (event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function (e) {
                const data = JSON.parse(e.target.result);
                localStorage.setItem('categories', JSON.stringify(data.categories));
                localStorage.setItem('links', JSON.stringify(data.links));
                window.location.reload();
            };
            reader.readAsText(file);
        };
        input.click();
    });
});
