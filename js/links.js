document.addEventListener('DOMContentLoaded', function () {
    const linksList = document.getElementById('links-list');
    const links = JSON.parse(localStorage.getItem('links')) || [];

    function renderLinks() {
        linksList.innerHTML = '';

        links.forEach(link => {
            const linkDiv = document.createElement('div');
            linkDiv.className = 'link-item';
            linkDiv.innerHTML = `
                <span>${link.linkName}</span>
                <button class="edit-link-btn">Edit</button>
                <button class="delete-link-btn">Delete</button>
            `;
            linksList.appendChild(linkDiv);

            const editBtn = linkDiv.querySelector('.edit-link-btn');
            const deleteBtn = linkDiv.querySelector('.delete-link-btn');

            editBtn.addEventListener('click', function () {
                // Load link data into form for editing
            });

            deleteBtn.addEventListener('click', function () {
                const index = links.findIndex(l => l.id === link.id);
                if (index > -1) {
                    links.splice(index, 1);
                    localStorage.setItem('links', JSON.stringify(links));
                    renderLinks();
                }
            });
        });
    }

    renderLinks();
});
