document.addEventListener('DOMContentLoaded', function(){
    Array.from(document.getElementsByClassName('draggable')).forEach(element => {InitializeElement(element)})
});

function InitializeElement(element) {
    console.log('Started InitializeElement Function for ', element)
    element.style.position = 'absolute'

    // Drag Button
    const DragButton = element.getElementsByClassName('drag-button')[0]
    let Dragging = false
    DragButton.addEventListener('click', function(){ DisableObjectOptions(element); Dragging = true });

    // Move Object when Dragging is Enabled
    document.addEventListener('mousemove', function(e){
        if (Dragging === true) {
            e.preventDefault()

            element.style.top = (e.clientY-(element.offsetHeight/2))+'px';
            element.style.left = (e.clientX-(element.offsetWidth/2)) + 'px';
        }
    });

    // Resize
    const ResizeButton = element.getElementsByClassName('resize-button')[0]
    let Resizing = false
    let ShowAlert = true
    ResizeButton.addEventListener('click', function(){
        DisableObjectOptions(element)
        Resizing = true
        if (ShowAlert === true) {
            ShowAlert = false
        }
        element.style.resize = 'both'
        element.style.overflow = 'auto'
    });

    // Delete
    const DeleteButton = element.getElementsByClassName('delete-button')[0]
    DeleteButton.addEventListener('click', function(){
        element.remove()
        console.log('Deleted element')
    });
    
    // Finish
    document.addEventListener('keyup', function(e){
        e.preventDefault()
        if (e.key === "Enter" && (Dragging === true || Resizing === true)) {
            document.body.focus()
            Dragging = false
            Resizing = false
            Finish(element)
        }
    })
}

function DisableObjectOptions(element) {
    const Options = Array.from(element.getElementsByClassName('object-options')[0].children)
    Options.forEach(option => {option.disabled = true})
}

function Finish(element) {
    element.removeEventListener('keyup', Finish)

    const Options = Array.from(element.getElementsByClassName('object-options')[0].children)

    const DragButton = element.getElementsByClassName('drag-button')[0]
    const ResizeButton = element.getElementsByClassName('resize-button')[0]
    const DeleteButton = element.getElementsByClassName('delete-button')[0]

    element.style.resize = 'none'
    element.style.overflow = ''

    Options.forEach(option => {option.disabled = false})
}