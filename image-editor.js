import {LitElement, html, css, query} from 'lit-element';
import '@vaadin/vaadin-split-layout/vaadin-split-layout.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/iron-autogrow-textarea/iron-autogrow-textarea.js';



const data = [
  {left: 0.8359073359073359, top: 0.3303684879288437, text: "請問您要\n紅茶還是\n咖啡呢？", comment: ""},
  {left: 0.6332046332046332, top: 0.33799237611181704, text: "阿，我要紅茶", comment: ""},
  {left: 0.861003861003861, top: 0.6073697585768743, text: "大家都是\n女性呢", comment: ""},
  {left: 0.4980694980694981, top: 0.3252858958068615, text: "不過這樣不用在意\n別人的眼光也好", comment: ""},
  {left: 0.8861003861003861, top: 0.7852604828462516, text: "呼啊", comment: ""},
  {left: 0.3359073359073359, top: 0.747141041931385, text: "好想睡覺喔", comment: ""},
];

export class ImageEditor extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        border: solid 1px gray;
        padding: 16px;
        max-width: 100%;
      }
      .editor {
        width: 100%;
        height: 600px;
      }
      .im-side {
        width: 800px;
        position: relative;
      }
      .tb-side {
        width: 100%;
        height: auto;
      }
      .im {
        /* position: absolute; */
        width: 100%;
        height: auto;
      }
      .labels {
        position: absolute;
        left: 0px;
        top: 0px;
        /* background-color: rgba(100, 0, 0, 0.3); */
      }
      .label {
        position: absolute;
        background-color: darkred;
        color: white;
        padding: 2px 8px;
        font-size: 1.5em;
        box-shadow: 1px 1px 3px rgba(1,0,0,0.5),
                    inset 1px 1px 1px #ffffff70,
                    inset -1px -1px 1px #00000070;
        border-radius: 2px;
      }
      .bbox {
        position: absolute;
        border: solid 2px red;
        box-shadow: 1px 1px 1px blue;
      }
      .grid {
        display: grid;
        grid-template-columns: 48px 60% auto;
        grid-gap: 4px;
      }
      .cell {
        border-radius: 3px;
        padding: 4px 8px;
        background-color: #f0f0f0;
        scrollbar-width: 0px;
      }
      .thead {
        border-radius: 3px;
        background-color: lightgray;
      }
      .tarea {
        border: none;
        width: 100%;
        padding: 0px;
        margin: -4px 0px 0px -4px;
      }
      .hovered-label {
        filter: brightness(2.0);
      }
    `;
  }

  static get properties() {
    return {
      /**
       * The name to say "Hello" to.
       */
      img_src: {type: String},
      items: {type: Array, attribute: false},
      _hovered_idx: {type: Number},
    };
  }

  constructor() {
    super();
    this.img_src = '';
    this.items = data;
    this._hovered_idx = -1;
  }

  _add_label(left, top) {
    // Explicitly trigger property update
    // The this.items must be assigned
    this.items = [
      ...this.items,
      {
        left: left,
        top: top,
        text: '',
        comment: '',
      }
    ]
  }

  _on_wheel(e) {
    if (e.shiftKey) {
      console.log('P')
      e.preventDefault;
    }
  }

  _update_labels_size() {
    const im = this.shadowRoot.querySelector('#im');
    const labels = this.shadowRoot.querySelector('#labels');
    console.log(im.width);
    labels.style.width = `${im.getBoundingClientRect().width}px`;
    console.log(labels.style.width);
    labels.style.height = `${im.getBoundingClientRect().height}px`;
  }

  _on_image_load(e) {
    this._update_labels_size();
  }

  _on_mouseover_item(e) {
    const idx = e.target.dataset.idx;
    this._hovered_idx = idx;
  }

  _on_mouseout_item(e) {
    this._hovered_idx = -1;
  }

  _on_click_image(e) {
    const im = this.shadowRoot.querySelector('#im');
    const left = e.offsetX / im.clientWidth;
    const top = e.offsetY / im.clientHeight;
    if (left < 0 || left > 1 || top < 0 || top > 1) {
      return;
    }
    this._add_label(left, top);
    console.log(this.items.length)
  }

  _on_text_change(e) {
    console.log(e.target.tagName, e.target.id);
    const idx = e.target.dataset.idx;
    const column = e.target.dataset.column;
    if (column == 'text') {
      this.items[idx].text = e.target.value;
    } else {
      this.items[idx].comment = e.target.value;
    }
    console.log(this.items);
  }

  _on_text_focus(e) {
    const idx = e.target.dataset.idx;
    const label = this.shadowRoot.querySelector(`#label-${idx}`);
    label.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
  }

  render() {
    return html`
      <h1>Image Editor Web Component! ${this.items.length}</h1>
      <vaadin-split-layout class="editor" @iron-resize=${this._update_labels_size}>
        <div id="im-side" class="im-side">
          <img id="im" class="im" src="${this.img_src}" @load=${this._on_image_load}>
          <div id="labels" class="labels" @click="${this._on_click_image}">
            ${
              this.items.map((e, idx) => html`
                <div id='label-${idx}'
                     data-idx=${idx}
                     class=${"label" + (this._hovered_idx == idx ? " hovered-label" : "")}
                     style="left: ${e.left * 100}%; bottom: ${(1.0 - e.top) * 100}%"
                     @mouseover=${this._on_mouseover_item}
                     @mouseout=${this._on_mouseout_item}
                >
                  ${idx + 1}
                </div>
              `)
            }
          </div>
        </div>
        <div class="tb-side">
          <div id="grid" class="grid">
            <div class="cell thead">ID</div>
            <div class="cell thead">譯文</div>
            <div class="cell thead">註解</div>
            ${
              this.items.map((e, idx) => html`
                <label class="cell">${idx + 1}</label>
                <div class=${"cell" + (this._hovered_idx == idx ? " hovered-label" : "")} @mouseover=${this._on_mouseover_item} @mouseout=${this._on_mouseout_item}>
                  <iron-autogrow-textarea 
                    data-idx=${idx}
                    data-column='text' 
                    class="tarea"
                    value="${e.text}"
                    @value-changed=${this._on_text_change}
                    @focus=${this._on_text_focus}
                  >
                  </iron-autogrow-textarea>
                </div>
                <div class="cell">
                  <iron-autogrow-textarea data-idx=${idx} data-column='comment' class="tarea" value="${e.comment}" @value-changed=${this._on_text_change}></iron-autogrow-textarea>
                </div>
              `)
            }
          </div>
        </div>
      </vaadin-split-layout>
      <slot></slot>
    `;

  }


}

window.customElements.define('image-editor', ImageEditor);
  