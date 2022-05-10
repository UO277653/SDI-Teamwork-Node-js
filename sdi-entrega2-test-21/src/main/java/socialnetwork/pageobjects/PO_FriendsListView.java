package socialnetwork.pageobjects;

import org.junit.jupiter.api.Assertions;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_FriendsListView extends PO_NavView{

    public static void checkFriendList(WebDriver driver, int locale){
        driver.navigate().to("localhost:8090/friend/list");
        String checkText = PO_NavView.getP().getString("label.name", locale);
        List<WebElement> result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
        checkText = PO_NavView.getP().getString("label.surname", locale);
        result = PO_View.checkElementBy(driver, "text", checkText);
        Assertions.assertEquals(checkText, result.get(0).getText());
    }
}
