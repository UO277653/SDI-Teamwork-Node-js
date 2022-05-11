package socialnetwork.pageobjects;

import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_PublicationListView {
    public static String getPublicationState(WebDriver driver, String state) {

        return driver.findElement(By.id(state)).getText();
    }

    public static void checkOwnPublications(WebDriver driver, int locale){
        driver.navigate().to("localhost:8090/publication/listown");
        String checkText = PO_NavView.getP().getString("label.title", locale);
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
        checkText = PO_NavView.getP().getString("label.text",locale);
        result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
        checkText = PO_NavView.getP().getString("label.date", locale);
        result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }
}
