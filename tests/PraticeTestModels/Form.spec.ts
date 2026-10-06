import {test , expect } from '@playwright/test';
import {FormPage} from '../../src/Pages/FormPage'

test('FormFilling ', async({page})=>{
    const FormPageObj  = new FormPage(page)
    
    await FormPageObj.goto()
    await FormPageObj.enterDetails()
    await FormPageObj.DC();
    await FormPageObj.autoCompleteSubjects("Maths");
     await FormPageObj.autoCompleteSubjects("Hindi");
     await FormPageObj.deleteSubjects("Maths");
     await FormPageObj.autoCompleteSubjects("Maths");
    await FormPageObj.stateSelect("NCR");
    
})