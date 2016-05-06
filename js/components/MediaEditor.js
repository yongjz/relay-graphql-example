import React from 'react';
import ReactDOM from 'react-dom';
import {
  AtomicBlockUtils,
  Editor,
  EditorState,
  Entity,
  RichUtils,
  convertToRaw,
} from 'draft-js';
import Immutable from 'immutable';

export default class MediaEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.focus = () => this.refs.editor.focus();
    this.onChange = (editorState) => this.setState({editorState});
    this.logState = () => {
      const content = this.state.editorState.getCurrentContent();
      console.log(convertToRaw(content));
    };

    this.handleKeyCommand = this._handleKeyCommand.bind(this);
    this.addMedia = this._addMedia.bind(this);
    this.addAudio = this._addAudio.bind(this);
    this.addImage = this._addImage.bind(this);
    this.addVideo = this._addVideo.bind(this);

    this.handleFileInput = this.handleFileInput.bind(this)
    this.insertFile = this.insertFile.bind(this)
  }
  handleFileInput(e){
    // This just converts e.target.files form a FileList to an Array
    var files = Array.prototype.slice.call(e.target.files, 0)
    files.forEach(this.insertFile)
  };

  insertFile(file){
    var editor = this.refs['editor']
    var entityKey = editor.insertBlockComponent("image", {src: URL.createObjectURL(file)})

    // Do asynchronouse upload
    setTimeout(() => {
      var imgStyle = {}
      // Modify the appearance of the image, just for demo purposes
      imgStyle.filter = 'hue-rotate(180deg)'
      imgStyle.MozFilter = 'hue-rotate(180deg)'
      imgStyle.WebkitFilter = 'hue-rotate(180deg)'
      imgStyle.OFilter = 'hue-rotate(180deg)'
      imgStyle.MsFilter = 'hue-rotate(180deg)'
      var test = Entity.mergeData(entityKey, {
        // Would normally change the src attribute with the new url
        // but we'll just change the appearance for this demo
        style: imgStyle,
      })

      alert('Image updated, type a character to see the change.')
    }, 2000)

  };

  _handleKeyCommand(command) {
    const {editorState} = this.state;
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }
    return false;
  }

  _addMedia(type) {
    const src = window.prompt('Enter a URL');
    if (!src) {
      return;
    }

    const entityKey = Entity.create(type, 'IMMUTABLE', {src});

    return AtomicBlockUtils.insertAtomicBlock(
      this.state.editorState,
      entityKey,
      ' '
    );
  }

  _addAudio() {
    this.onChange(this._addMedia('audio'));
  }

  _addImage() {
    console.log('image');
    this.onChange(this._addMedia('image'));
  }

  _addVideo() {
    this.onChange(this._addMedia('video'));
  }

  render() {
    return (
      <div style={styles.root}>
        <div style={{marginBottom: 10}}>
          Use the buttons to add audio, image, or video.
        </div>
        <div style={{marginBottom: 10}}>
          Here are some local examples that can be entered as a URL:
          <ul>
            <li>media.mp3</li>
            <li>media.png</li>
            <li>media.mp4</li>
          </ul>
        </div>
        <div style={styles.buttons}>
          <button onMouseDown={this.addAudio} style={{marginRight: 10}}>
            Add Audio
          </button>
          <button onMouseDown={this.addImage} style={{marginRight: 10}}>
            Add Image
          </button>
          <button onMouseDown={this.addVideo} style={{marginRight: 10}}>
            Add Video
          </button>
        </div>
        <div style={styles.editor} onClick={this.focus}>
          <Editor
            blockRendererFn={mediaBlockRenderer}
            editorState={this.state.editorState}
            handleKeyCommand={this.handleKeyCommand}
            onChange={this.onChange}
            placeholder="Enter some text..."
            ref="editor"
          />
        </div>
        <input
          onClick={this.logState}
          style={styles.button}
          type="button"
          value="Log State"
        />
      </div>
    );
  }
}

function mediaBlockRenderer(block) {
  if (block.getType() === 'atomic') {
    return {
      component: Media,
      editable: false,
    };
  }

  return null;
}

const Audio = (props) => {
  return <audio controls src={props.src} style={styles.media} />;
};

const Image = (props) => {
  return <img src={props.src} style={styles.media} />;
};

const Video = (props) => {
  return <video controls src={props.src} style={styles.media} />;
};

const Media = (props) => {
  const entity = Entity.get(props.block.getEntityAt(0));
  const {src} = entity.getData();
  const type = entity.getType();
  console.log(src);
  let media;
  if (type === 'audio') {
    media = <Audio src={src} />;
  } else if (type === 'image') {
    media = <Image src={src} />;
  } else if (type === 'video') {
    media = <Video src={src} />;
  }

  return media;
};

const styles = {
  root: {
    fontFamily: '\'Georgia\', serif',
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  editor: {
    border: '1px solid #ccc',
    cursor: 'text',
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    textAlign: 'center',
  },
  media: {
    width: '100%',
  },
};
