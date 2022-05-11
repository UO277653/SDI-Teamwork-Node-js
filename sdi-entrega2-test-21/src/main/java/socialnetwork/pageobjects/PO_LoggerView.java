package socialnetwork.pageobjects;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;

import java.util.List;

public class PO_LoggerView {

    public static boolean verifyThatThereAreNOfLogMessages(WebDriver driver, int n) {

        List<WebElement> logs = driver.findElements(By.id("tipoLogin"));

        int counterPET = 0, counterALTA = 0, counterLOGINEX = 0, counterLOGINERR = 0, counterLOGOUT = 0;

        for(WebElement element: logs){
            if(element.getText().equals("PET")){
                counterPET++;
            } else if(element.getText().equals("ALTA")){
                counterALTA++;
            } else if(element.getText().equals("LOGIN_EX")){
                counterLOGINEX++;
            } else if(element.getText().equals("LOGIN_ERR")){
                counterLOGINERR++;
            } else if(element.getText().equals("LOGOUT")){
                counterLOGOUT++;
            }
        }

        return counterPET >= n && counterALTA >= n && counterLOGINEX >= n && counterLOGINERR >= n && counterLOGOUT >= n;
    }
}
