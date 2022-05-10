package socialnetwork.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

public class PO_LoginView extends PO_NavView {

    static public void fillLoginForm(WebDriver driver, String email, String passwordp){
        WebElement actualDni = driver.findElement(By.name("username"));
        actualDni.click();
        actualDni.clear();
        actualDni.sendKeys(email);

        WebElement password = driver.findElement(By.name("password"));
        password.click();
        password.clear();
        password.sendKeys(passwordp);

        By boton = By.className("btn");
        driver.findElement(boton).click();
    }

    static public void login(WebDriver driver, String email, String password){
        //Vamos al formulario de logueo.
        PO_NavView.clickOption(driver, "login", "class", "btn btn-primary");
        //Rellenamos el formulario
        PO_LoginView.fillLoginForm(driver, email, password);
        //COmprobamos que entramos en la pagina privada de Alumno
    }

    static public void logout(WebDriver driver){
        PO_NavView.clickOption(driver, "logout", "class", "btn btn-primary");
    }

}
