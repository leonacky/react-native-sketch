import React from 'react';
import {
  NativeModules,
  requireNativeComponent,
  StyleSheet,
  View,
} from 'react-native';

const { func, number, string, bool } = React.PropTypes;

const SketchManager = NativeModules.RNSketchManager || {};
const BASE_64_CODE = 'data:image/jpg;base64,';

const styles = StyleSheet.create({
  base: {
    flex: 1,
    height: 200,
  },
});

export default class Sketch extends React.Component {

  static propTypes = {
    imageBackground: string,
    fillColor: string,
    onReset: func,
    onUpdate: func,
    clearButtonHidden: bool,
    strokeColor: string,
    strokeThickness: number,
    style: View.propTypes.style,
  };

  static defaultProps = {
	imageBackground: '',
    fillColor: '#ffffff',
    onReset: () => {},
    onUpdate: () => {},
    clearButtonHidden: false,
    strokeColor: '#000000',
    strokeThickness: 1,
    style: null,
  };

  constructor(props) {
    super(props);
    this.onReset = this.onReset.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
  }

  onReset() {
    this.props.onUpdate(null);
    this.props.onReset();
  }

  onUpdate(e) {
    this.props.onUpdate(`${BASE_64_CODE}${e.nativeEvent.image}`);
  }

  saveImage(image) {
    if (typeof image !== 'string') {
      return Promise.reject('You need to provide a valid base64 encoded image.');
    }

    const src = image.indexOf(BASE_64_CODE) === 0 ? image.replace(BASE_64_CODE, '') : image;
    return SketchManager.saveImage(src);
  }

  clear() {
    return SketchManager.clear();
  }

  render() {
    return (
      <RNSketch
        {...this.props}
        onChange={this.onUpdate}
        onReset={this.onReset}
        style={[styles.base, this.props.style]}
      />
    );
  }

}

const RNSketch = requireNativeComponent('RNSketch', Sketch);
