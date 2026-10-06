import {test , expect ,Locator , Page} from '@playwright/test'

test.describe("POPUS" , ()=>{
    
    

    test("Click Button to see Ok  alert" , async({page})=>{
    
        await page.goto("https://demoqa.com/alerts")
        const buttonOkalert : Locator  =  page.locator('#alertButton');

       
     await expect (buttonOkalert).toBeVisible()


     page.on('dialog' , async dialog =>{
        console.log('AlertMessage:' ,dialog.message());
        expect (dialog.message()).toBe('You clicked a button')
        await dialog.accept();

     })
     await buttonOkalert.click()      

    })

    test('Prompt POPUP', async({page})=>{
           await page.goto("https://demoqa.com/alerts")
            const butttonPromptalert : Locator = page.locator('#promtButton');
        await expect(butttonPromptalert).toBeVisible()
        page.on('dialog' , async dialog =>{

            const message  = dialog.message()
            console.log('alertMessage:' , message)

                await expect(message).toBe('Please enter your name')
                await dialog.accept("Jashu")

        })
        await butttonPromptalert .click()


    })



    test('confirmButtonPopup' , async({page})=>{
        await page.goto('https://demoqa.com/alerts')
    const confirmPopButton : Locator  = page.locator('#confirmButton')  
    page.on('dialog', async dialog =>{
        const message  = dialog.message();
        await expect(message).toBe('Do you confirm action?')
         await dialog.dismiss();
    })

    await confirmPopButton.click()


    })

    test('Time alert Popup' , async ({page})=>{
        await page.goto("https://demoqa.com/alerts")
        const timealertButton : Locator = page.locator('#timerAlertButton')
         await expect(timealertButton).toBeVisible();

         const dialogPromise = page.waitForEvent('dialog');
         await timealertButton .click()
         const dialog = await dialogPromise ;
         console.log('alertMessage:', dialog.message())
         
       await dialog.accept();
    })


    // HOw TO hanld  A new Tab comes when we click we get a new tab means new page


    test(' new Tab comes when we click we get a new tab means new page' , async({page})=>{
        await page.goto("https://demoqa.com/browser-windows")

           const newPagePromise = page.waitForEvent('popup');

        const newTabButton  = page.locator('#tabButton')
        await expect(newTabButton).toBeVisible();
        await newTabButton .click()
        const newpage  = await newPagePromise
        await newpage.waitForLoadState()

    await expect(newpage.locator('body'))
        .toContainText('This is a sample page');
        await newpage.close()

        await page.bringToFront()
        console.log(await page.title())
         await newTabButton .click()

      
        

    })


    test('NewWindwo' , async({page})=>{
        await page.goto("https://demoqa.com/browser-windows")

        const newPromiseWindow  =  page.waitForEvent('popup')
        const windowButton : Locator  = page.locator('#windowButton')
        const windowMessageButton : Locator = page.locator('#messageWindowButton')
        await windowButton.click();
        const newWindow  = await newPromiseWindow;
        await newWindow .waitForLoadState()
          
       await expect(newWindow.locator('body'))
       .toContainText('This is a sample page')
        await newWindow.close();

        await  expect(windowMessageButton).toBeVisible();
        const newMessageWindow = page.waitForEvent('popup')
        await windowMessageButton.click()
        const newMessageWindow1  = await newMessageWindow ;
        await newMessageWindow1.waitForLoadState()

        await expect(newMessageWindow1.locator('body')).toContainText('Knowledge increases by sharing but not by saving. Please share this website with your friends and in your organization.')
        
    await newMessageWindow1.close();

  console.log(await page.title());



    })

})