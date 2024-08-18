"use client";
import { Button } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";

export default function Navbar() {
return (
    <Button leftIcon={<ArrowForwardIcon />} colorScheme='teal' variant='outline'>
    Retour
  </Button>
);
}