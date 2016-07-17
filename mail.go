package main

import (
    "net/smtp"
	"github.com/jordan-wright/email"
)

func main() {
	e := email.NewEmail()
	e.Subject = "WATERMELON"
	e.From = "Digitalfort <admin@digitalfort.io>"
	e.To = []string{"zachechouafni@gmail.com"}
	e.HTML = []byte("<h1>SCRUFFED JAYS</h1><br><p>Your account activation link is: APE</p>")
	e.Send("127.0.0.1:25", smtp.PlainAuth("", "admin@digitalfort.io", "Jupiter3301!", "127.0.0.1"))
}
