"use client";

import uitmLogo from "@/assets/UiTM Logo Vector.svg";
import AdminGuide from "@/components/AdminGuide.mdx";
import Image from "next/image";

const Page = () => {
	return (
		<>
			<article className="px-10 prose dark:prose-invert py-10 m-auto">
				<div className="px-10 flex flex-col justify-center items-center">
					<Image
						src={uitmLogo}
						width={500}
						alt="UITM Logo"
						
						priority
					/>
				</div>
				<AdminGuide />
			</article>
		</>
	);
};

export default Page;
