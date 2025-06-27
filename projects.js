const url= base_url;
async function loadProjects() {
    try {
        const response = await fetch(url+'getProjects.php');
        const result = await response.json();

        if (result.success) {
            const projectsList = document.getElementById('projects-list');
            if (result.data.length > 0) {
                projectsList.innerHTML = '';
                result.data.forEach(project => {
                    const projectCard = document.createElement('div');
                    projectCard.className = 'item-card';
                    projectCard.innerHTML = `
                        <h3>${project.name}</h3>
                        <p>${project.description || 'No description available'}</p>
                    `;
                    projectCard.addEventListener('click', () => {
                        showProjectEditForm(project.id, project.name, project.description);
                    });
                    projectsList.appendChild(projectCard);
                });
            } else {
                projectsList.innerHTML = 'No projects added yet';
            }
        } else {
            alert('Failed to load projects: ' + result.error);
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        alert('Error loading projects!');
    }
}
function showProjectEditForm(id, name, description) {
    const editForm = document.getElementById(`project-edit-form`);
    if (editForm) {
        document.getElementById(`edit-project-id`).value = id;
        document.getElementById(`edit-project-name`).value = name;
        document.getElementById(`edit-project-description`).value = description;
        toggleForm(`project-edit-form`);
    }
}

window.addEventListener('load', loadProjects);


async function deleteProject(event) {
    event.preventDefault();
    if (confirm('Are you sure you want to delete this project?')) {
        const projectId = document.getElementById('edit-project-id').value;
        handleDeleteProject(projectId);
    }
}
async function handleDeleteProject(projectId) {
    try {
        const response = await fetch(url+`deleteProject.php?id=${projectId}`, {
            method: 'DELETE',
        });
        const rawResponse = await response.text();
        const result = JSON.parse(rawResponse);
        if (result.success) {
            alert('Project deleted successfully!');
            toggleForm('project-edit-form');
            loadProjects();
        } else {
            alert('Failed to delete project: ' + result.error);
        }
    } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project!');
    }
}
function toggleForm(formId) {
    const form = document.getElementById(formId);
    form.style.display = form.style.display === 'block' ? 'none' : 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

async function handleAddProject(event) {
    event.preventDefault();
    const projectData = {
        name: document.getElementById('project-name').value,
        description: document.getElementById('project-description').value,
    };
    if (!projectData.name) {
        alert('Project name is required.');
        return;
    }
    try {
        const response = await fetch(url+'addProject.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Project added successfully!');
            toggleForm('project-form');
            loadProjects();
        } else {
            alert('Failed to add project: ' + result.error);
        }
    } catch (error) {
        console.error('Error adding project:', error);
        alert('Error adding project!');
    }
}

async function saveEditProject() {
    const projectData = {
        id: document.getElementById('edit-project-id').value,
        name: document.getElementById('edit-project-name').value,
        description: document.getElementById('edit-project-description').value,
    };
    try {
        const response = await fetch(url+'editProject.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData),
        });
        const result = await response.json();
        if (result.success) {
            alert('Project saved!');
            toggleForm('project-edit-form');
            loadProjects();
        } else {
            alert('Failed to edit project: ' + result.error);
        }
    } catch (error) {
        console.error('Error editting project:', error);
        alert('Error editting project!');
    }
}