import { FormControl, ValidationErrors } from "@angular/forms";

export class Luv2ShopValidators {

    //whitespace validatons
    static notOnlyWhiteSpaces(control:FormControl):ValidationErrors{

        //contains white spaces 
        if(control.value!=null && control.value.trim().length===0){

            return {'notOnlyWhiteSpaces':true}

        }

        else{



        return null;
        }
    }
}
