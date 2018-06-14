import React, { Component } from 'react';
import './style/BlurEraser.scss';
import createjs from 'createjs';
import testImage from './assets/img/test.jpg';


class BlurEraser extends Component{ 
    componentDidMount(){
        this.getDimension();
        this.getScaledImage();
        this.stage = new createjs.Stage('blurEraser');
        this.image = new Image();
        this.image.onload = this.handleImageComplete;
    }

    getScaledImage = () => {
        let canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        let tmpStage = new createjs.Stage(canvas);
        let orgImage = new Image();
        orgImage.onload = () => {
            let bitmap = new createjs.Bitmap(orgImage);
            let scale = this.calculateScale(orgImage);
            bitmap.scaleX = bitmap.scaleY = scale;
            bitmap.x = (this.width - orgImage.width * scale) / 2;
            bitmap.y = (this.height - orgImage.height * scale) / 2;  
            tmpStage.addChild(bitmap);
            tmpStage.update();
            this.image.src = canvas.toDataURL();
        }
        orgImage.src = testImage;
    }

    getDimension = () => {
        this.height = this.container.offsetHeight;
        this.width = this.container.offsetWidth;
        this.canvas.height = this.height;
        this.canvas.width = this.width;
    }

    calculateScale = (image) => {
        let w = this.width, 
            h = this.height;

        let xratio = w / image.width,
            yratio = h / image.height,
            scale = Math.min(xratio, yratio);
        return scale
    }

    handleImageComplete = (e) => { 
        createjs.Touch.enable(this.stage);
        this.stage.enableMouseOver();
        this.stage.addEventListener("stagemousedown", this.handleMouseDown);
        this.stage.addEventListener("stagemousemove", this.handleMouseMove);
        this.drawingCanvas = new createjs.Shape();
		this.drawingCanvas.cache(0, 0, this.width, this.height);

        this.bitmap = new createjs.Bitmap(this.image);
       
        let maskFilter = new createjs.AlphaMaskFilter(this.drawingCanvas.cacheCanvas);
		this.bitmap.filters = [maskFilter];
        this.bitmap.cache(0, 0, this.width, this.height);

        let blur = new createjs.Bitmap(this.image);

		blur.filters = [new createjs.BlurFilter(24, 24, 2), new createjs.ColorMatrixFilter(new createjs.ColorMatrix(60))];
        blur.cache(0, 0, this.width, this.height);

        this.stage.addChild(blur, this.bitmap);
        
        this.cursor = new createjs.Shape(new createjs.Graphics().beginFill("#FFFFFF").drawCircle(20, 10, 25));
		this.cursor.cursor = "pointer";
        this.stage.addChild(this.cursor);
        this.stage.update();
    }

    handleMouseDown = (e) => {
        this.oldPoint = new createjs.Point(this.stage.mouseX, this.stage.mouseY);
        this.oldMPoint = this.oldPoint;

    }

    handleMouseMove = (e) => {
        this.cursor.x = this.stage.mouseX;
        this.cursor.y = this.stage.mouseY;

        let midPoint = new createjs.Point(this.oldPoint.x + this.stage.mouseX >> 1, this.oldPoint.y + this.stage.mouseY >> 1);
		this.drawingCanvas.graphics.clear()
				.setStrokeStyle(40, "round", "round")
				.beginStroke("rgba(0,0,0,0.2)")
				.moveTo(midPoint.x, midPoint.y)
				.curveTo(this.oldPoint.x, this.oldPoint.y, this.oldMPoint.x, this.oldMPoint.y);
		this.oldPoint.x = this.stage.mouseX;
		this.oldPoint.y = this.stage.mouseY;
		this.oldMPoint.x = midPoint.x;
		this.oldMPoint.y = midPoint.y;
		this.drawingCanvas.updateCache("source-over");
		this.bitmap.updateCache();
		this.stage.update();
    }

    render() {
        return(
            <div className="blurEraser-container">
                BlurEraser
                <div 
                    className="canvas-container"
                    ref = {ref => {
                        this.container = ref;
                    }}>
                    <canvas
                        id='blurEraser'
                        className="blur-eraser-canvas"
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

export default BlurEraser;