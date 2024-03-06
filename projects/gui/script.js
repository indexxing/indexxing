const Workspace = document.getElementById('workspace')
const ObjectTemplates = document.getElementById('object-templates')

let SelectedObject = null;

let Dragging = false
let CanDrag = true
let Resizing = false

const PropertiesObject = {
    UILabel: [
        {
            name: "Text",
            onUpdate: function(element, newValue){ element.getElementsByClassName('text')[0].value = newValue }
        }
    ]
}

document.addEventListener('DOMContentLoaded', function(){
    Array.from(document.getElementsByClassName('object')).forEach(element => {
        if (element.parentElement.id !== "object-templates") {
            InitializeElement(element)
            element.setAttribute('data-initialized', true)
        }
    })
});

function InitializeElement(element) {
    UpdateWorkspaceProperties()
    console.log('Started InitializeElement Function for ', element)

    element.style.position = 'absolute'

    element.addEventListener('click', function(){
        SelectObject(element)
    })

    // Drag Button
    const DragButton = element.getElementsByClassName('drag-button')[0]
    DragButton.addEventListener('mousedown', function(){
        SelectObject(element)
        if (CanDrag === true) {
            DisableObjectOptions(element);
            Dragging = true
        }
    });

    // Resize
    const ResizeButton = element.getElementsByClassName('resize-button')[0]
    ResizeButton.addEventListener('click', function(){
        SelectObject(element)
        DisableObjectOptions(element)
        Resizing = true
        element.style.resize = 'both'
        element.style.overflow = 'auto'
    });

    // Delete
    const DeleteButton = element.getElementsByClassName('delete-button')[0]
    DeleteButton.addEventListener('click', function(){
        element.remove()
        console.log('Deleted element')
        UpdateWorkspaceProperties()
    });
}

// Move Object when Dragging is Enabled
document.addEventListener('mousemove', function(e){
    if (Dragging === true) {
        e.preventDefault()

        SelectedObject.style.top = (e.clientY-(SelectedObject.offsetHeight/2))+'px';
        SelectedObject.style.left = (e.clientX-(SelectedObject.offsetWidth/2)) + 'px';
    }
});

// Finish
document.addEventListener('mouseup', function(){
    Dragging = false
    CanDrag = true
    Resizing = false
    Finish(SelectedObject)
});

function NewObject(className) {
    const ClassTemplate = ObjectTemplates.querySelector(`[data-class="${className}"]`)
    if (ClassTemplate !== undefined) {
        const Clone = ClassTemplate.cloneNode(true)
        Workspace.appendChild(Clone)
        InitializeElement(Clone)
        Clone.setAttribute('data-initialized', true)
    } else {
        alert('That class does not exist!')
    }
}

function SelectObject(element) {
    if (SelectedObject !== null) {
        SelectedObject.classList.remove('selected')
    }
    if (SelectedObject !== element) {
        SelectedObject = element
        SelectedObject.classList.add('selected')
    }
}

function DisableObjectOptions(element) {
    const Options = Array.from(element.getElementsByClassName('object-options')[0].children)
    Options.forEach(option => {option.disabled = true})
}

function Finish(element) {
    element.removeEventListener('keyup', Finish)

    const Options = Array.from(element.getElementsByClassName('object-options')[0].children)
    Options.forEach(option => {option.disabled = false})

    element.style.resize = 'none'
    element.style.overflow = ''
}

function UpdateWorkspaceProperties() {
    const WorkspaceProperties = document.getElementById('workspace-properties')

    WorkspaceProperties.innerHTML = `
    <li>Object Count: ${Workspace.children.length}</li>
    `
}