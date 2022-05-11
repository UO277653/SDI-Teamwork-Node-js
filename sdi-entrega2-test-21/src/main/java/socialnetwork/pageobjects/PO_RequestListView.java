package socialnetwork.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class PO_RequestListView {

    static public int countRequestsOnPage(WebDriver driver, int page) {
        driver.navigate().to("localhost:3000/friends/list?page=" + page);
        return driver.findElements(By.id("acceptBtn")).size();
    }
}
