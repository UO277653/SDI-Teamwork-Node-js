package socialnetwork.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_Api extends PO_NavView {

    static public void fillLoginForm(WebDriver driver, String email, String passwordp){
        WebElement actualEmail = driver.findElement(By.name("email"));
        actualEmail.click();
        actualEmail.clear();
        actualEmail.sendKeys(email);

        WebElement password = driver.findElement(By.name("password"));
        password.click();
        password.clear();
        password.sendKeys(passwordp);

        By boton = By.id("boton-login");
        driver.findElement(boton).click();
    }

    static public void goToApi(WebDriver driver){
        driver.get("localhost:3000/apiclient/client.html");
    }

}
