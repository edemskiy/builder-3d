import React, { Component } from 'react';

class ObjectControl extends Component {
  render() {
    return (
      <div className="hidden elements-block" id="objectControls">
         <div className="flex-row content-start">
            <button className="btn hidden" id="unGroup">Разгруппировать</button>
            <button className="btn" id="cloneObject">Копировать</button>
            <button className="btn" id="deleteObject">Удалить</button>
         </div>

         <div className="changeSize sett-block flex-row" id="changeSize">
            <div> Ширина: <input type="number" name="rangeX" min="1" id="changeSizeX"/> </div>
            <div> Высота: <input type="number" name="rangeY" min="1" id="changeSizeY"/> </div>
            <div> Глубина: <input type="number" name="rangeZ" min="1" id="changeSizeZ"/> </div>
         </div>

         <div className="flex-row rotateY">
            <div className="sett-block">
            Поворот: <input type="number" name="rotateY" id="rotateObjectY"/>
            </div>
            <div className="sett-block flex-row" id="changePosition">
               <div>x: <input type="number" id="xPosition" /></div>
               <div>y: <input type="number" id="yPosition" /></div>
               <div>z: <input type="number" id="zPosition" /></div>
            </div>
         </div>

         <div className="axisSettings  sett-block flex-row">
            <div className="flex-row">
               Ось x: <input type="checkbox" defaultChecked="checked" className="checkbox" id="axisX" />
               <label htmlFor="axisX"></label>
            </div>
            <div className="flex-row">
               Ось y: <input type="checkbox" className="checkbox" id="axisY" />
               <label htmlFor="axisY"></label>
            </div>
            <div className="flex-row">
               Ось z: <input type="checkbox" defaultChecked="checked" className="checkbox" id="axisZ" />
               <label htmlFor="axisZ"></label>
            </div>                  
         </div>
         
         <div className="flex-row">
            <div className="sett-block">
               <div className="flex-row">
                  Прилипание объектов: <input type="checkbox" className="checkbox" id="objectsStick" />
                  <label htmlFor="objectsStick"></label>
               </div>         
            </div>
            <div className="sett-block">
               <div className="flex-row">
                  Прилипание к сетке: <input type="checkbox" className="checkbox" id="gridStick" />
                  <label htmlFor="gridStick"></label>
               </div>
            </div>
         </div>
      </div>
    );
  }
}

export default ObjectControl;