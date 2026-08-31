"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Point d'entrée GSAP unique de l'app : le plugin est enregistré ici une seule fois.
gsap.registerPlugin(useGSAP);

export { gsap, useGSAP };
