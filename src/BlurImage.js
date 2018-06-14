import React, { Component } from 'react';
import testImage from './assets/img/test.jpg';
import './style/BlurImage.scss';
const StackBlurImage = require('./StackBlur');


class BlurImage extends Component {
    componentDidMount = () => {
        this.ctx = this.canvas.getContext("2d");
        this.setSize();
        this.loadImage();
    }

    loadImage = (imageSrc) => {
        let img = new Image();
        img.onload = () => {
            StackBlurImage(img, this.canvas, 10, this.width, this.height);
        }
        img.src = testImage;
    }

    setSize = () => {
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
    }

    render() {
        return (
            <div class="image-container">
                <div 
                    className='canvas-container'
                    ref = {ref => {
                        this.container = ref;
                    }}
                >
                    <canvas
                        className="blur-image-canvas"
                        ref = {
                            ref => {
                                this.canvas = ref;
                            }}    
                    />
                </div>
            </div>
        )
    }
}

export default BlurImage;
