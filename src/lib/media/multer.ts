import multer, {memoryStorage} from "multer" ;
export function multerUpload (){
    return multer({
        storage: memoryStorage() 
        // او disStorage({}) بس دي بتاخد {options}  ومش لازم نقولها الاوبيشنز 
    });
}

export function multerUploadSingle(fieldName: string) {
   return multerUpload().single(fieldName)

}
export function multerUploadArray(fieldName: string ,maxCount: number ){
   return multerUpload().array(fieldName, maxCount)
}