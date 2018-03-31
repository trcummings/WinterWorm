// export default (state) => {
//   // get current camera
//
//   const cameraTransform = this.camera.transform; // matrix
//   const worldTransform = this.worldContainer.worldTransform; //matrix
//
//   // lets do the fast version as we know there is no rotation..
//   const a = this.worldContainer.scale.x;
//   const d = this.worldContainer.scale.y;
//
//   const tx = this.worldContainer.position.x - this.worldContainer.pivot.x * a;
//   const ty = this.worldContainer.position.y - this.worldContainer.pivot.y * d;
//
//   worldTransform.a  = a  * cameraTransform.a;
//   worldTransform.b  = a  * cameraTransform.b;
//   worldTransform.c  = d  * cameraTransform.c;
//   worldTransform.d  = d  * cameraTransform.d;
//   worldTransform.tx = (tx * cameraTransform.a) + (ty * cameraTransform.c) + cameraTransform.tx;
//   worldTransform.ty = (tx * cameraTransform.b) + (ty * cameraTransform.d) + cameraTransform.ty;
//
//   return state;
// };
//
// var mat = this.getInverseMatrix();
//     var wt = this.transform;
//
//     wt.a  = mat[0];
//     wt.b  = mat[1];
//     wt.c  = mat[2];
//     wt.d  = mat[3];
//     wt.tx = mat[4];
//     wt.ty = mat[5];

export default state => state;
