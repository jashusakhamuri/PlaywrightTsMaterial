import {Page , Locator, expect} from '@playwright/test';

export class FormPage{
    readonly page :Page ;
    readonly firstName : Locator;
    readonly lastName : Locator;
    readonly Email : Locator;
    readonly Gender : Locator;
    readonly DOB : Locator;
    readonly multipleSubjects : Locator;
    readonly mobileNumber : Locator;
    readonly HobbiesCheckBox: Locator;
    readonly currentAddress : Locator;
    readonly state : Locator;
    readonly city : Locator;
    readonly submitbutton : Locator;
    readonly monthSelect : Locator;
    readonly  yearsSelect : Locator;


    constructor(page:Page){
        this.page = page;
        this.firstName = page.locator('#firstName')
        this.lastName = page.locator('#lastName')
        this.Email = page.locator('#userEmail')
        this.DOB  =  page.locator('#dateOfBirthInput')
        this.Gender = page.getByLabel('Female')
        this.mobileNumber = page.locator('#userNumber')
        this.multipleSubjects = page.locator('#subjectsInput') 
        this.HobbiesCheckBox = page.getByLabel('Sports')
        this.currentAddress =page.getByPlaceholder('Current Address')
        this.state = page.locator('#state')
        this.city = page.locator('#react-select-4-placeholder')
        this.submitbutton = page.getByRole('button',{name:'Submit'})
        this.monthSelect = page.locator('.react-datepicker__month-select');
        this.yearsSelect = page.locator('.react-datepicker__year-select'); 
    }

    async goto(){
        await this.page.goto("https://demoqa.com/automation-practice-form")
    }

    async  enterDetails(){
        await this.firstName.fill("Jaswanth");
        await this.lastName.fill("Sakhamuri");
        await this.Email.fill("jashu@gmail.com");
        await this.mobileNumber.fill("1234567890");
        await this.currentAddress.fill("Koppparu 1-53 / guntur districst , Hyderabad , Telgana");
        await this.HobbiesCheckBox.check();
        await this.Gender.check()

    }
    async DC(){

        await this.DOB.click();
        
           await this.monthSelect.selectOption({
      label: "January"
    });
    await this.yearsSelect.selectOption({
        label: "2004"
    })
    await this.page.locator('.react-datepicker__day:not(.react-datepicker__day--outside-month)').getByText("14", {exact:true}).click()


    }

    async autoCompleteSubjects(subj:string){
        await  this.multipleSubjects.fill(subj)
        const option = this.page.getByRole('option', {
            name:subj,
            exact:true
        })
        await option.click()
    }

    async deleteSubjects(subj:String){

         const removeButton  = this.page.getByRole('button', {name: `Remove ${subj}` })
        await removeButton.click()
    }

    async stateSelect (state:string){
       
          await this.state.click();

    await this.page.getByRole('option', {
        name: state,
        exact: true
    }).click();
    }

   
      
}