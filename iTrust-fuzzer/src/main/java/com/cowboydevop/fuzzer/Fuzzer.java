package com.cowboydevop.fuzzer;

import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.expr.BinaryExpr;
import com.github.javaparser.ast.expr.StringLiteralExpr;
import com.github.javaparser.ast.expr.IntegerLiteralExpr;
import com.github.javaparser.ast.stmt.IfStmt;
import com.github.javaparser.ast.stmt.Statement;
import com.github.javaparser.ast.body.TypeDeclaration;
import com.github.javaparser.ast.visitor.ModifierVisitor;
import com.github.javaparser.ast.visitor.Visitable;
import com.github.javaparser.utils.CodeGenerationUtils;
import com.github.javaparser.utils.SourceRoot;
import com.github.javaparser.JavaParser;

import java.io.IOException;
import java.nio.file.Paths;
import java.lang.reflect.Method;

import java.util.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.charset.StandardCharsets;


/**
 * Some code that uses JavaParser.
 */
public class Fuzzer {

    private static String path = "../iTrust2/iTrust2/src/main/java/edu/ncsu/csc/itrust2";
    private static int    numFilesToChange = 5;
    private static double mutationRate = 25/100;
    private static Random randomizer = new Random();

    public static void main(String[] args) throws IOException {
        
        List<String> results = new ArrayList<String>();

        // recursively find files and store names in results list
        Files.walk(Paths.get(path))
            .filter(Files::isRegularFile)
            .forEach(fname -> results.add(fname.toString()));

        // remove everything that is not java or has models in path
        for (int i = 0; i < results.size(); i++){
            if (!results.get(i).contains(".java") || results.get(i).contains("/models/")){
                results.remove(i);
            }
        }

        if (numFilesToChange > results.size()){
            numFilesToChange = results.size();
        }

        for (int i = 0; i < numFilesToChange; i++){
            String fname = results.get(randomizer.nextInt(results.size())).toString();
            String fuzzedFileContent = fuzzFile(fname);
            overwrite(fname, fuzzedFileContent);

            results.remove(fname);
            System.out.println("File Modified: " + fname);
        }
    }

    /*
     * Overwrite file with fuzzed file content
     */
    public static void overwrite(String fileName, String content) throws IOException {
        try (PrintWriter out = new PrintWriter(new FileOutputStream(fileName, false))) {
            out.print(content);
            out.close();
        }
    }
        

    /*
     * Pass in filename, fuzz the file
     */
    public static String fuzzFile(String fileName) throws IOException {
        // Heres the fuzzing part...
        FileInputStream in = new FileInputStream(fileName);

        CompilationUnit cu = JavaParser.parse(in);

        cu.accept(new ModifierVisitor<Void>() {
            /**
             * For every string, change the value
             */
            @Override
            public Visitable visit(final StringLiteralExpr n, final Void arg) {

                // determine if we wanna mutate
                if (randomizer.nextDouble() > mutationRate){return n;}

                //String v = n.getValue();
                //System.out.println(v);
                n.setValue("new val");
                return n;
            }

            /**
             * For every integer, change the value
             */
            @Override
            public Visitable visit(final IntegerLiteralExpr n, final Void arg) {

                // determine if we wanna mutate
                if (randomizer.nextDouble() > mutationRate){return n;}

                n.setValue(Integer.toString(randomizer.nextInt()));
                return n;
            }


            /**
             * For every if-statement, see if it has a comparison using "!=" or "==" make it the opposite
             * For every if-statement, see if it has a comparison using ">" or "<" make it the opposite
             */
            @Override
            public Visitable visit(IfStmt n, Void arg) {

                // determine if we wanna mutate
                if (randomizer.nextDouble() > mutationRate){return n;}

                // Figure out what to get and what to cast simply by looking at the AST in a debugger! 
                n.getCondition().ifBinaryExpr(binaryExpr -> {
                    if (binaryExpr.getOperator() == BinaryExpr.Operator.NOT_EQUALS || binaryExpr.getOperator() == BinaryExpr.Operator.EQUALS) {
                        if (binaryExpr.getOperator() == BinaryExpr.Operator.NOT_EQUALS) {
                            binaryExpr.setOperator(BinaryExpr.Operator.EQUALS);
                        } else {
                            binaryExpr.setOperator(BinaryExpr.Operator.NOT_EQUALS);
                        }
                    }
    
                    if (binaryExpr.getOperator() == BinaryExpr.Operator.GREATER || binaryExpr.getOperator() == BinaryExpr.Operator.LESS) {
                        if (binaryExpr.getOperator() == BinaryExpr.Operator.GREATER) {
                            binaryExpr.setOperator(BinaryExpr.Operator.LESS);
                        } else {
                            binaryExpr.setOperator(BinaryExpr.Operator.GREATER);
                        }
                    }
                });
                return super.visit(n, arg);
            }
        }, null);

        return cu.toString();
    }
    
}
