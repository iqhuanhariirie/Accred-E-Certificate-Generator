"use client";

import uitmLogo from "@/assets/UiTM Logo Vector.svg";
import { AdminLoginButton } from "@/components/AdminLoginButton";
import { RingLoader } from "@/components/RingLoader";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";

export const LoginCard = () => {
	const { loading } = useAuth();
	const currentYear = new Date().getFullYear();
	if (loading) {
		return (
			<div className="h-full w-full flex items-center justify-center">
				<RingLoader />
			</div>
		);
	} else {
		return (
			<>
				<Card className="w-96 flex flex-col items-center justify-center ">
					<CardHeader className="flex flex-col items-center justify-center gap-3">
						<Image
							src={uitmLogo}
							width={200}
							alt="UITM Logo"
							priority
						/>
						<CardTitle className="text-center">
							Event E-Certificate System Admin Page
						</CardTitle>
					</CardHeader>
					<CardContent className="text-center">
						<AdminLoginButton />
					</CardContent>
					
				</Card>
			</>
		);
	}
};
