package socialnetwork.pageobjects;
import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_UserListView {

    static public int countUsersOnPageAdmin(WebDriver driver, int page){

        driver.navigate().to("localhost:3000/admin/list");
        return driver.findElements(By.cssSelector("#tableUsers tbody tr")).size();

    }

    public static void delete(WebDriver driver) {
        List<WebElement> removeButton = driver.findElements(By.id("deleteBtn"));
        removeButton.get(0).click();
    }

    public static void search(WebDriver driver, String searchText) {
        WebElement searchBar = driver.findElement(By.name("searchText"));
        searchBar.click();
        searchBar.clear();
        searchBar.sendKeys(searchText);
        driver.findElement(By.id("searchButton")).click();
    }


}
