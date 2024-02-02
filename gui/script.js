document.addEventListener('DOMContentLoaded', function(){
    Array.from(document.getElementsByClassName('draggable')).forEach(element => {DragElement(element)})
});

function DragElement(element) {
    console.log('Started DragElement Function for ' + element)
    element.style.position = 'absolute'

    const DragButton = element.getElementsByClassName('drag-button')[0]
    let Dragging = false
    DragButton.addEventListener('click', function(){
        Dragging = true
    });
    document.addEventListener('mousedown', function(e){
        if (Dragging === true) {
            e.preventDefault()
            Dragging = false
        }
    });
    element.addEventListener('mousemove', function(e){
        if (Dragging === true) {
            console.log('Drag')
            e.preventDefault()

            element.style.top = (e.clientY-(element.offsetHeight/2))+'px';
            element.style.left = (e.clientX-(element.offsetWidth/2)) + 'px';
        }
    });

    const ResizeButton = element.getElementsByClassName('resize-button')[0]
    let Resizing = false
    ResizeButton.addEventListener('click', function(){
        Resizing = !Resizing
        if (Resizing === true) {
            alert('Click the "Resize" button again to stop re-sizing.')
            element.style.resize = 'both'
            element.style.overflow = 'auto'
            DragButton.disabled = 'true'
        } else {
            element.style.resize = 'none'
            element.style.overflow = ''
            DragButton.disabled = ''
        }
    });
}