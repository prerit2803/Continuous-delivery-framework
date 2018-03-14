Only need to run this once:
mvn clean install


Run this every time you change code:
mvn compile
mvn exec:java -Dexec.mainClass="com.yourorganization.maven_sample.LogicPositivizer"