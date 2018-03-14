package com.yourorganization.maven_sample;

import com.github.javaparser.ast.CompilationUnit;
import com.github.javaparser.ast.expr.BinaryExpr;
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


/**
 * Some code that uses JavaParser.
 */
public class LogicPositivizer {
    public static void main(String[] args) throws IOException {
        
        List<String> results = new ArrayList<String>();

        String path = "../iTrust2";

        Files.walk(Paths.get(path))
        .filter(Files::isRegularFile)
        .forEach(fname -> results.add(fname.toString()));

        Random randomizer = new Random();
        String fname = results.get(randomizer.nextInt(results.size())).toString();
        System.out.println(fname);

        FileInputStream in = new FileInputStream(fname);
        System.exit(0);
        // Our sample is in the root of this directory, so no package name.
        CompilationUnit cu = JavaParser.parse(in);

        cu.accept(new ModifierVisitor<Void>() {
            /**
             * For every if-statement, see if it has a comparison using "!=".
             * Change it to "==" and switch the "then" and "else" statements around.
             */
            @Override
            public Visitable visit(IfStmt n, Void arg) {
                // Figure out what to get and what to cast simply by looking at the AST in a debugger! 
                n.getCondition().ifBinaryExpr(binaryExpr -> {
                    // System.out.println(binaryExpr.getOperator());
                    if (binaryExpr.getOperator() == BinaryExpr.Operator.NOT_EQUALS || binaryExpr.getOperator() == BinaryExpr.Operator.EQUALS) {
                        if (binaryExpr.getOperator() == BinaryExpr.Operator.NOT_EQUALS) {
                            binaryExpr.setOperator(BinaryExpr.Operator.EQUALS);
                        } else {
                            binaryExpr.setOperator(BinaryExpr.Operator.NOT_EQUALS);
                        }
                    }
    
                    if (binaryExpr.getOperator() == BinaryExpr.Operator.GREATER || binaryExpr.getOperator() == BinaryExpr.Operator.LESS) {
                        // System.out.println('GT or LT');
                        if (binaryExpr.getOperator() == BinaryExpr.Operator.GREATER) {
                            binaryExpr.setOperator(BinaryExpr.Operator.LESS);
                        } else {
                            binaryExpr.setOperator(BinaryExpr.Operator.GREATER);
                        }
                    }
                });
                //Method[] methods = n.getClass().getMethods();
                //for (int i = 0; i < methods.length; i++) {
			    //    System.out.println("public method: " + methods[i]);
		        //}
                //System.out.println('\n');
                //System.out.println(n.getClass().getMethods());
                System.out.println(n);
                return super.visit(n, arg);
            }
        }, null);

        /*
        cu.accept(new ModifierVisitor<Void>() {
            @Override
            public Visitable visit(TypeDeclaration n, Void arg) {
                System.out.println(n);
                return super.visit(n, arg);
            }
        }, null);
        */

        /*
        // This saves all the files we just read to an output directory.  
        sourceRoot.saveAll(
                // The path of the Maven module/project which contains the LogicPositivizer class.
                CodeGenerationUtils.mavenModuleRoot(LogicPositivizer.class)
                        // appended with a path to "output"
                        .resolve(Paths.get("output")));
        */
    }
}
