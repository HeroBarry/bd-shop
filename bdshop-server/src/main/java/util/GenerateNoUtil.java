package util;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

public class GenerateNoUtil {


    //生成流水号
    public static String toDateString() {
        SimpleDateFormat format = new SimpleDateFormat("yyyyMMddHHmmss");
        Random rom = new Random();
        int num = rom.nextInt(10000) + 10000;
        return format.format(new Date()) + num;
    }
}
