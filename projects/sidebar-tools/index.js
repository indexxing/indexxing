document.addEventListener('DOMContentLoaded', function(){
    let FullURL;
    const URLInput = document.getElementById('url')
    const URLParams = new URLSearchParams(new URL(window.location.origin + '/tools.html').search)
    const URLSections = []
    const ToolList = document.getElementById('tool-list')
    const Tools = window.Tools
  
    const TypeInput = document.getElementById('viewType')
  
    Object.keys(Tools).forEach(tool => {
      tool = Tools[tool]
      const Constructor = new tool()
      if (Constructor.enabled === true) {
        const Element = CreateCheckboxElement(Constructor)
        ToolList.appendChild(Element)
  
        const Checkbox = Element.getElementsByTagName('input')[0]
        Checkbox.addEventListener('click', function(){
          if (Checkbox.checked === true) {
            URLSections.push(Checkbox.name)
          } else {
            URLSections.splice(URLSections.indexOf(Checkbox.name), 1)
          }
  
          Update()
        });
      }
    })
  
    TypeInput.addEventListener('change', Update);
  
    function Update() {
      if (URLSections.length > 0) {
        FullURL = `${window.location.origin}/projects/sidebar-tools/view.html?viewType=${TypeInput.options[TypeInput.selectedIndex].value}&tools=${URLSections.join(',')}`
        URLInput.value = FullURL
      } else {
        URLInput.value = 'At least 1 tool has to be selected!'
      }
  
      if (URLSections.length === Object.keys(Tools).length) {
        FullURL = `${window.location.origin}/projects/sidebar-tools/view.html?viewType=${TypeInput.options[TypeInput.selectedIndex].value}&tools=*`
        URLInput.value = FullURL
      }
    }
  
    function CreateCheckboxElement(tool) {
      const Li = document.createElement('li')
      Li.classList = 'mb-2'
      Li.innerHTML = `
      <div class="form-check">
        <input type="checkbox" name="${tool.id}" class="form-check-input tool-checkbox">
        <label for="randomnumber" class="form-check-label">
          <label class="small-heading text-muted mb-0">${tool.title} | </label>
          <label class="mb-0">${tool.desc}</label>
        </label>
      </div>
      `
      return Li
    }
  
    const AllToolsCheckbox = document.getElementById('all-tools-checkbox')
    AllToolsCheckbox.addEventListener('click', function(){
      Array.from(document.getElementsByClassName('tool-checkbox')).forEach(checkbox => {
        if (checkbox.checked === false && AllToolsCheckbox.checked === true) {checkbox.click()}
        if (checkbox.checked === true && AllToolsCheckbox.checked === false) {checkbox.click()}
      });
    });
  
    const BookmarkModal = document.getElementById('bookmark-modal')
    const BookmarkClose = BookmarkModal.getElementsByClassName('dialog-close')[0]
    const BookmarkInput = document.getElementById('bookmark-input')
    const BookmarkQuickAdd = document.getElementById('bookmark-quick-add')
    const BookmarkToggle = document.getElementById('bookmark-generate')
    BookmarkToggle.addEventListener('click', function(){
      if (!URLSections.length > 0) {return}
      GenerateBookmark()
      BookmarkModal.showModal()
    });
    function GenerateBookmark() {
      const Code = `
      const ExistingModal = document.getElementById('SidebarTools-Bookmark-Modal');
      if (ExistingModal === null) {
        const Modal = document.createElement('div');
        Modal.id = 'SidebarTools-Bookmark-Modal';
        Modal.setAttribute('style', \`
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
        \`);
        Modal.innerHTML = \`
        <iframe src="${FullURL}&iframe=true" style="width: 100%; height: 100%;"></iframe>
        \`;
        document.body.prepend(Modal);
      } else {
        ExistingModal.close();
      }
      `
  
      const Bookmark = `javascript:(()=>{${encodeURIComponent(Code.split('\n').join(''))}})()`
      BookmarkInput.value = Bookmark
      BookmarkQuickAdd.href = Bookmark
  
      BookmarkModal.showModal()
    }
  
    BookmarkClose.addEventListener('click', function(){
      BookmarkModal.close()
    });
});