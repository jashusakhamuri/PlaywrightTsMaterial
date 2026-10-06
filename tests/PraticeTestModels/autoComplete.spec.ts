
import {test , expect} from '@playwright/test'
import {autoCompletePage} from '../../src/Pages/autoCompletePage' 


test.describe("ReactSelect",  ()=>{
    let obj1 :autoCompletePage 
    test("MutipleSelectBOdy", async({page})=>{
         obj1 = new autoCompletePage(page)

         await obj1.goto()
         await obj1.multipleColors("Green")
         await obj1.multipleColors("Red")

         await obj1.delete("Green")
         await obj1.multipleColors("Green")
         await obj1.singlecolor("Red")
         await obj1.singlecolor('Black')

    })
})