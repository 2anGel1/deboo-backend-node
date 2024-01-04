import { Hr, Preview, Section, Text } from "@react-email/components";
import React from "react";
import Logo from "./logo";
import { BaseMail, box, hr, paragraph, title, code } from "./base-mail";

interface PasswordResetMailProps {
  verificationCode: string;
}

const PasswordResetMail = ({ verificationCode }: PasswordResetMailProps) => {
  return (
    <BaseMail>
      <Section style={box}>
        <Logo />
        <Hr style={hr} />
        <Text style={{ ...title, marginBottom: 20 }}>
          Reinitialisation de votre mot de passe
        </Text>

        <Text style={paragraph}>Votre code est </Text>

        <code style={code}>
          {verificationCode}
        </code>
        <Hr style={hr} />
      </Section>
    </BaseMail>
  );
};

export default PasswordResetMail;
