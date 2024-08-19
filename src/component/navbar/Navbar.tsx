"use client";
import { Button } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-neutral p-4 flex justify-between items-center">
      <div>
        <Link href="/home" passHref>
          <Button
            leftIcon={<ArrowBackIcon />}
            colorScheme="teal"
            variant="outline"
            mt={4}
            ml={4}
          >
            Home
          </Button>
        </Link>
      </div>
    </nav>
  );
}
