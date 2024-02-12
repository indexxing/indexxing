class base {
    constructor() {
      this.element = null
    }
  
    get(query) {
      return this.element.getElementsByClassName(this.id + '-' + query)[0] || null;
    }
  }
  
  const Tools = {
    color: class color extends base {
      constructor() {
        super();
        this.enabled = true
        this.id = 'color'
        this.title = 'Color'
        this.desc = 'Find a color\'s HEX code or RGB.'
        this.html = `
        <div class="row">
          <div class="col mb-3" style="height: 225px;">
            <input type="color" class="form-control form-control-lg ${this.id}-color" value="#000" style="height: 100%;">
          </div>
          <div class="col-md-6">
            <p class="small-heading text-muted mb-0">HEX Color Code <a href="#" class="text-decoration-none ${this.id}-copyHEX"><i class="bx bx-clipboard"></i></a></p>
            <h2 class="${this.id}-hexresult">#000</h2>
            <br>
            <p class="small-heading text-muted mb-0">RGB Color Code <a href="#" class="text-decoration-none ${this.id}-copyRGB"><i class="bx bx-clipboard"></i></a></p>
            <h2 class="${this.id}-rgbresult">0, 0, 0</h2>
          </div>
        </div>
        `
      }
  
      initialize(element){
        this.element = element
        const ColorInput = this.get('color')
        const HEXResult = this.get('hexresult')
        const RGBResult = this.get('rgbresult')
  
        const CopyHEXBtn = this.get('copyHEX')
        const CopyRGBBtn = this.get('copyRGB')
  
        ColorInput.addEventListener('input', function(){
          const RGB = HEXToRGB(ColorInput.value)
          HEXResult.innerText = (ColorInput.value).toString()
          RGBResult.innerText = `${RGB.R}, ${RGB.G}, ${RGB.B}`
        });
  
        CopyHEXBtn.addEventListener('click', function(){
          navigator.clipboard
            .writeText(HEXResult.innerText.replace('#', ''))
            .then(() => {
              alert('Successfully copied HEX color code to clipboard!')
            })
            .catch(() => {
              alert('Failure to copy HEX color code.')
            })
        });
  
        CopyRGBBtn.addEventListener('click', function(){
          navigator.clipboard
            .writeText(RGBResult.innerText)
            .then(() => {
              alert('Successfully copied RGB color code to clipboard!')
            })
            .catch(() => {
              alert('Failure to copy RGB color code.')
            })
        });
  
        function HEXToRGB(HEXColor) {
          HEXColor = HEXColor.replace('#', '');
  
          if (HEXColor.length === 3) {
            HEXColor = HEXColor.split('').map(char => char + char).join('');
          }
  
          return {
            R: parseInt(HEXColor.substring(0, 2), 16),
            G: parseInt(HEXColor.substring(2, 4), 16),
            B: parseInt(HEXColor.substring(4, 6), 16)
          }
        }
      }
    },
  
    randomnumber: class randomnumber extends base {
      constructor() {
        super();
        this.enabled = true
        this.id = 'randomnumber'
        this.title = 'Random Number Generator'
        this.desc = 'Returns a random number.'
        this.html = `
        <div class="row text-center">
          <div class="col">
            <p class="small-heading text-muted mb-0">Whole</p>
            <h2 class="${this.id}-roundedresult">-</h2>
          </div>
          <div class="col">
            <p class="small-heading text-muted mb-0">Decimal</p>
            <h2 class="${this.id}-accurateresult">-</h2>
          </div>
        </div>
        <div class="form-floating mb-2">
          <input type="number" class="form-control ${this.id}-min" name="${this.id}-min" placeholder="Minimum..." value="1">
          <label for="${this.id}-min">Minimum</label>
        </div>
        <div class="form-floating mb-2">
          <input type="number" class="form-control ${this.id}-max" name="${this.id}-max" placeholder="Maximum..." value="10">
          <label for="${this.id}-max">Maximum</label>
        </div>
        <!--
        <input type="number" class="form-control form-control-sm ${this.id}-min" placeholder="Minimum number..." value="1">
        <input type="number" class="form-control form-control-sm ${this.id}-max" placeholder="Maximum number..." value="10">
        --!>
        <button class="btn btn-primary mx-auto d-block ${this.id}-randomizebtn">Randomize</button>
        `
      }
  
      initialize(element){
        this.element = element
        const RoundedResult = this.get('roundedresult')
        const AccurateResult = this.get('accurateresult')
        const Min = this.get('min')
        const Max = this.get('max')
        const RandomizeBtn = this.get('randomizebtn')
  
        RandomizeBtn.addEventListener('click', function(){
          const Number = Math.random() * (Max.value - Min.value) + Min.value;
          console.log(Number, parseFloat(Number))
          RoundedResult.innerText = Math.floor(Number)
          AccurateResult.innerText = parseFloat(Number).toFixed(2)
        });
      }
    },
  
    charcounter: class charcounter extends base {
      constructor() {
        super();
        this.enabled = true
        this.id = 'charcounter'
        this.title = 'Character Counter'
        this.desc = 'Counts all characters in a string.'
        this.html = `
        <textarea type="text" class="form-control mb-2 ${this.id}-text" placeholder="String to count goes here..."></textarea>
        <button class="btn btn-primary mx-auto d-block mb-2 ${this.id}-countbtn">Count</button>
        <div class="row text-center">
          <div class="col">
            <small class="mb-1 text-muted text-monospace">Characters</small>
            <h2 class="${this.id}-characters">0</h2>
          </div>
          <div class="col">
            <small class="mb-1 text-muted text-monospace">Characters (excluding spaces)</small>
            <h2 class="${this.id}-accurate">0</h2>
          </div>
        </div>
        `
      }
      
      initialize(element){
        this.element = element
        const Text = this.get('text')
        const CountBtn = this.get('countbtn')
  
        const Characters = this.get('characters')
        const Accurate = this.get('accurate')
  
        CountBtn.addEventListener('click', function(){
          Characters.innerText = Text.value.length
          Accurate.innerText =  Text.value.replace(/\s/g, '').length
        });
      }
    },
  
    loremipsum: class loremipsum extends base {
      constructor() {
        super();
        this.enabled = true
        this.id = 'loremipsum'
        this.title = 'Lorem Ipsum Generator'
        this.desc = 'Generates lorem ipsum text commonly used as placeholder text.'
        this.dependencies = [
          {display: "lorem-ipsum@2.0.8", URL: "https://www.jsdelivr.com/package/npm/lorem-ipsum"}
        ]
        this.html = `
        <div class="row mb-2">
          <div class="col">
            <button class="btn btn-success btn-sm w-100 mb-2 ${this.id}-generatebtn">Generate Paragraph</button>
          </div>
          <div class="col">
            <button class="btn btn-primary btn-sm w-100 mb-2 ${this.id}-copybtn">Copy Result</button>
          </div>
        </div>
        <p class="${this.id}-result"></p>
        `
      }
      
      async initialize(element){
        this.element = element
        const { LoremIpsum } = await import('https://cdn.jsdelivr.net/npm/lorem-ipsum@2.0.8/+esm')
        const GenerateBtn = this.get('generatebtn')
        const CopyBtn = this.get('copybtn')
        const Result = this.get('result')
  
        const Generator = new LoremIpsum({
          sentencesPerParagraph: {
            max: 8,
            min: 4
          },
          wordsPerSentence: {
            max: 16,
            min: 4
          }
        });
  
        GenerateBtn.addEventListener('click', function(){
          Result.innerText = Generator.generateParagraphs(1)
        });
  
        CopyBtn.addEventListener('click', function(){
          navigator.clipboard
            .writeText(Result.innerText)
            .then(() => {
              alert('Successfully copied paragraph to clipboard!')
            })
            .catch(() => {
              alert('Failure to copy paragraph to clipboard.')
            })
        });
      }
    },
  
    "romannumeral-converter": class romannumeralconverter extends base {
      constructor() {
        super();
        this.enabled = true
        this.id = 'romannumeral-converter'
        this.title = 'Roman Numeral Converter'
        this.desc = 'Converts roman numerals to numbers or vise versa.'
        this.dependencies = [
          {display: "roman-numerals@0.3.2", URL: "https://www.jsdelivr.com/package/npm/roman-numerals"}
        ]
        this.html = `
        <input type="text" class="form-control mb-2 ${this.id}-romannumeral" placeholder="Roman Numeral...">
        <input type="text" class="form-control mb-2 ${this.id}-numberresult" placeholder="Number Result..." disabled>
        <button class="btn btn-primary mx-auto d-block mb-2 ${this.id}-convertnumeralbtn">Convert</button>
  
        <hr class="navbar-divider mt-3 mb-3 w-50 mx-auto">
  
        <input type="text" class="form-control mb-2 ${this.id}-number" placeholder="Number...">
        <input type="text" class="form-control mb-2 ${this.id}-romannumeralresult" placeholder="Roman Numeral Result..." disabled>
        <button class="btn btn-primary mx-auto d-block mb-2 ${this.id}-convertnumberbtn">Convert</button>
        `
      }
      
      async initialize(element){
        this.element = element
        const RomanNumerals = await import('https://cdn.jsdelivr.net/npm/roman-numerals@0.3.2/+esm')
  
        const RomanNumeralInput = this.get('romannumeral')
        const NumberResultInput = this.get('numberresult')
        const NumberInput = this.get('number')
        const RomanNumeralResultInput = this.get('romannumeralresult')
        const ConvertNumeralBtn = this.get('convertnumeralbtn')
        const ConvertNumberBtn = this.get('convertnumberbtn')
  
        ConvertNumeralBtn.addEventListener('click', function(){
          NumberResultInput.value = RomanNumerals.toArabic(RomanNumeralInput.value)
        });
  
        ConvertNumberBtn.addEventListener('click', function(){
          RomanNumeralResultInput.value = RomanNumerals.toRoman(NumberInput.value)
        });
      }
    },
  
    notepad: class notepad extends base {
      constructor() {
        super();
        this.enabled = true
        this.id = 'notepad'
        this.title = 'Notepad'
        this.desc = 'Write that down! Write that down! '
        this.html = `
        <div class="card box mb-3">
          <div class="card-body">
            <ul class="list-unstyled mb-0">
              <li><span class="${this.id}-characters">0</span> characters</li>
              <li><span class="${this.id}-accurateChars">0</span> characters (excluding spaces)</li>
              <li><span class="${this.id}-lines">0</span> lines</li>
            </ul>
          </div>
        </div>
        <textarea class="form-control textarea-lg ${this.id}-textarea mb-3" placeholder="This notepad DOES NOT save..."></textarea>
        `
      }
      
      initialize(element){
        this.element = element
        const TextArea = this.get('textarea')
        const Characters = this.get('characters')
        const Accurate = this.get('accurateChars')
        const Lines = this.get('lines')
  
        TextArea.addEventListener('input', function(){
          Characters.innerText = TextArea.value.length
          Accurate.innerText = TextArea.value.replace(/\s/g, '').length
          Lines.innerText = TextArea.value.split('\n').length
        });
      }
    },
  
    oneLineText: class oneLineText extends base {
      constructor() {
        super();
        this.enabled = true
        this.id = 'oneLineText'
        this.title = 'One Line Text'
        this.desc = 'Simply that text!'
        this.html = `
        <textarea class="form-control textarea-lg ${this.id}-textarea mb-3" placeholder="This textarea DOES NOT save..."></textarea>
        <input type="text" class="form-control mb-3 ${this.id}-result" disabled>
        <button class="btn btn-primary ${this.id}-copybtn">Copy Result</button>
        `
      }
  
      initialize(element){
        this.element = element
        const TextArea = this.get('textarea')
        const Result = this.get('result')
        const CopyBtn = this.get('copybtn')
  
        TextArea.addEventListener('input', function(){
          Result.value = TextArea.value.split('\n').join('')
        });
  
        CopyBtn.addEventListener('click', function(){
          navigator.clipboard
            .writeText(Result.value)
            .then(() => {
              alert('Successfully copied result to clipboard!')
            })
            .catch(() => {
              alert('Failure to copy result to clipboard.')
            });
        });
      }
    }
}
  
window.Tools = Tools