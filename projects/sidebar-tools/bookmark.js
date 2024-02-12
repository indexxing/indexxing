// What is this?
// This is a  bookmark version that inserts an iframe so you can use your favorite tools easily!
// If you paste this code into a bookmark it won't work as code has to be formatted in one line, then encoded in URI component, and this code won't show your tools as an example URL is entered

const ExistingModal = document.getElementById('SidebarTools-Bookmark-Modal');
if (ExistingModal === null) {
  const ToolbarURL = "https://indexprojects.vercel.app/view.html?viewType=list&noDependencies=true&tools=*";

  const Modal = document.createElement('div');
  Modal.id = 'SidebarTools-Bookmark-Modal';
  Modal.setAttribute('style', `
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 450px;
  border-radius: 10px;
  padding: 0px;
  border: 1px solid #252525;
  margin: 10px;
  z-index: 100000;
  `);
  Modal.innerHTML = `
  <iframe src="${ToolbarURL}" style="width: 100%; height: 100%;"></iframe>
  `;
  document.body.prepend(Modal);
} else {
  ExistingModal.close();
}