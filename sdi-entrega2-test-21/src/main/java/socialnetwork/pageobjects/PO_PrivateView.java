package socialnetwork.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class PO_PrivateView extends PO_NavView {


    public static void goToUsersList(WebDriver driver) {
        driver.findElement(By.id("dropdownUsers")).click();
        driver.findElement(By.id("listUsersOption")).click();
    }
}
