package socialnetwork.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_SignUpView extends PO_NavView{

    /**
     * Fill signup form
     * @param driver
     * @param emailp
     * @param namep
     * @param surnamep
     * @param passwordp
     * @param passwordconfp
     */
    static public void fillForm(WebDriver driver, String emailp, String namep, String surnamep, String passwordp, String passwordconfp) {
        WebElement email = driver.findElement(By.name("email"));
        email.click();
        email.clear();
        email.sendKeys(emailp);
        WebElement name = driver.findElement(By.name("name"));
        name.click();
        name.clear();
        name.sendKeys(namep);
        WebElement surname = driver.findElement(By.name("surname"));
        surname.click();
        surname.clear();
        surname.sendKeys(surnamep);
        WebElement password = driver.findElement(By.name("password"));
        password.click();
        password.clear();
        password.sendKeys(passwordp);
        WebElement passwordConfirm = driver.findElement(By.name("passwordConfirm"));
        passwordConfirm.click();
        passwordConfirm.clear();
        passwordConfirm.sendKeys(passwordconfp);
        //Pulsar el boton de Alta.
//        By boton = By.className("btn");
        By boton = By.id("signup");
        driver.findElement(boton).click();
    }

    /**
     * Go directly to the singup view, and fill the form.
     * @param driver
     * @param emailp
     * @param namep
     * @param surnamep
     * @param passwordp
     * @param passwordconfp
     */
    public static void signup(WebDriver driver, String emailp, String namep, String surnamep, String passwordp, String passwordconfp){
        PO_NavView.clickOption(driver, "signup", "class", "btn btn-primary");
        PO_SignUpView.fillForm(driver, emailp, namep, surnamep, passwordp, passwordconfp);
    }
}
