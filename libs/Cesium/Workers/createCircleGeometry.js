/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.114
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

import{a as s}from"./chunk-EKIAV3IX.js";import"./chunk-6HS3B36T.js";import"./chunk-LAFYIXBI.js";import"./chunk-Y4WDS4E7.js";import"./chunk-NQBIZOW4.js";import"./chunk-G3ANYX6B.js";import"./chunk-H3IXAINZ.js";import{a as d}from"./chunk-SCJI2CER.js";import"./chunk-5W56CV6U.js";import"./chunk-FW5QB3YT.js";import"./chunk-Y3QWB4WF.js";import"./chunk-KJJSAVM5.js";import"./chunk-32QBF3VP.js";import"./chunk-VUQ65SO2.js";import"./chunk-XHQXTKN5.js";import"./chunk-CAREXCTE.js";import"./chunk-PF7ABWYW.js";import{a as l,d as a}from"./chunk-6A72MMRO.js";import"./chunk-4BEFMW7D.js";import"./chunk-UMJEX7YU.js";import"./chunk-72JWF3LF.js";import{a as c}from"./chunk-2F4MHS2T.js";import{b as p}from"./chunk-3Z2AZRQC.js";import{e as m}from"./chunk-A5XXOFX2.js";function n(e){e=c(e,c.EMPTY_OBJECT);let r=e.radius;p.typeOf.number("radius",r);let o={center:e.center,semiMajorAxis:r,semiMinorAxis:r,ellipsoid:e.ellipsoid,height:e.height,extrudedHeight:e.extrudedHeight,granularity:e.granularity,vertexFormat:e.vertexFormat,stRotation:e.stRotation,shadowVolume:e.shadowVolume};this._ellipseGeometry=new s(o),this._workerName="createCircleGeometry"}n.packedLength=s.packedLength;n.pack=function(e,r,o){return p.typeOf.object("value",e),s.pack(e._ellipseGeometry,r,o)};var x=new s({center:new l,semiMajorAxis:1,semiMinorAxis:1}),t={center:new l,radius:void 0,ellipsoid:a.clone(a.UNIT_SPHERE),height:void 0,extrudedHeight:void 0,granularity:void 0,vertexFormat:new d,stRotation:void 0,semiMajorAxis:void 0,semiMinorAxis:void 0,shadowVolume:void 0};n.unpack=function(e,r,o){let i=s.unpack(e,r,x);return t.center=l.clone(i._center,t.center),t.ellipsoid=a.clone(i._ellipsoid,t.ellipsoid),t.height=i._height,t.extrudedHeight=i._extrudedHeight,t.granularity=i._granularity,t.vertexFormat=d.clone(i._vertexFormat,t.vertexFormat),t.stRotation=i._stRotation,t.shadowVolume=i._shadowVolume,m(o)?(t.semiMajorAxis=i._semiMajorAxis,t.semiMinorAxis=i._semiMinorAxis,o._ellipseGeometry=new s(t),o):(t.radius=i._semiMajorAxis,new n(t))};n.createGeometry=function(e){return s.createGeometry(e._ellipseGeometry)};n.createShadowVolume=function(e,r,o){let i=e._ellipseGeometry._granularity,u=e._ellipseGeometry._ellipsoid,h=r(i,u),f=o(i,u);return new n({center:e._ellipseGeometry._center,radius:e._ellipseGeometry._semiMajorAxis,ellipsoid:u,stRotation:e._ellipseGeometry._stRotation,granularity:i,extrudedHeight:h,height:f,vertexFormat:d.POSITION_ONLY,shadowVolume:!0})};Object.defineProperties(n.prototype,{rectangle:{get:function(){return this._ellipseGeometry.rectangle}},textureCoordinateRotationPoints:{get:function(){return this._ellipseGeometry.textureCoordinateRotationPoints}}});var _=n;function g(e,r){return m(r)&&(e=_.unpack(e,r)),e._ellipseGeometry._center=l.clone(e._ellipseGeometry._center),e._ellipseGeometry._ellipsoid=a.clone(e._ellipseGeometry._ellipsoid),_.createGeometry(e)}var E=g;export{E as default};
