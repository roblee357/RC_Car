#include <Arduino.h>


/*
  VNH2SP30-Monster-Shield
  made on 01 Nov 2020
  by Amir Mohammad Shojaee @ Electropeak
  Home

*/

int pot;
int out;

#define PWM1 5
#define AIN1 4
#define AIN2 2

#define PWM2 6
#define BIN1 11
#define BIN2 7

// #define EN1 A0
// #define EN2 A1


void setup(){
  pinMode(BIN1,OUTPUT);
  pinMode(AIN1,OUTPUT);
  pinMode(AIN2,OUTPUT);
  pinMode(BIN2,OUTPUT);
  
  pinMode(PWM1,OUTPUT);
  pinMode(PWM2,OUTPUT);
   
  // pinMode(A0,OUTPUT);
  // pinMode(A1,OUTPUT);
  pinMode(A7,INPUT);
  
 }
 void loop(){
  // digitalWrite(A0,HIGH);
  // digitalWrite(A1,HIGH);
  
  digitalWrite(BIN1,HIGH);
  digitalWrite(BIN2,LOW);
  
  digitalWrite(AIN1,HIGH);
  digitalWrite(AIN2,LOW);

  pot=analogRead(A5);
  out=map(pot,0,1023,0,255);
  // analogWrite(PWM1,125); //Speed control of Motor A
  // analogWrite(PWM2,125); //Speed control of Motor B
  analogWrite(PWM1,out); //Speed control of Motor A
  analogWrite(PWM2,out); //Speed control of Motor B
  }
