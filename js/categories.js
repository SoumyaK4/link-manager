document.addEventListener('DOMContentLoaded', function () {
    const addCategoryPopup = document.getElementById('add-category-popup');
    const showAddCategoryPopup = document.getElementById('show-add-category-popup');
    const closeBtns = document.querySelectorAll('.close-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');
    const addCategoryForm = document.getElementById('add-category-form');
    const categoriesList = document.getElementById('categories-list');
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const links = JSON.parse(localStorage.getItem('links')) || [];

    showAddCategoryPopup.addEventListener('click', function () {
        addCategoryPopup.style.display = 'flex';
    });

    closeBtns.forEach(btn => btn.addEventListener('click', function () {
        btn.parentElement.parentElement.style.display = 'none';
    }));

    cancelCategoryBtn.addEventListener('click', function () {
        addCategoryPopup.style.display = 'none';
    });

    window.addEventListener('click', function (event) {
        if (event.target == addCategoryPopup) {
            addCategoryPopup.style.display = 'none';
        }
    });

    addCategoryForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const id = document.getElementById('category-id').value;
        const categoryName = document.getElementById('category-name').value.trim();

        if (id) {
            // Update existing category
            const index = categories.findIndex(category => category.id === id);
            categories[index] = categoryName;
        } else {
            // Add new category
            categories.push(categoryName);
        }

        localStorage.setItem('categories', JSON.stringify(categories));
        addCategoryPopup.style.display = 'none';
        renderCategories();
    });

    function renderCategories() {
        categoriesList.innerHTML = '';

        categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-item';
            categoryDiv.innerHTML = `
                <span class="category-link">${category}</span>
                <button class="edit-category-btn">Edit</button>
                <button class="delete-category-btn">Delete</button>
            `;
            categoriesList.appendChild(categoryDiv);

            const editBtn = categoryDiv.querySelector('.edit-category-btn');
            const deleteBtn = categoryDiv.querySelector('.delete-category-btn');

            editBtn.addEventListener('click', function () {
                document.getElementById('category-id').value = category;
                document.getElementById('category-name').value = category;
                addCategoryPopup.style.display = 'flex';
            });

            deleteBtn.addEventListener('click', function () {
                const index = categories.indexOf(category);
                if (index > -1) {
                    categories.splice(index, 1);
                    const updatedLinks = links.filter(link => link.category !== category);
                    localStorage.setItem('links', JSON.stringify(updatedLinks));
                    localStorage.setItem('categories', JSON.stringify(categories));
                    renderCategories();
                }
            });
        });
    }

    renderCategories();
});
