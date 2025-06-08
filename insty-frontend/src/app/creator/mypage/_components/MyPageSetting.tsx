"use client";

import { Switch } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { useLocalStorage } from "usehooks-ts";

function MyPageSetting() {
	// FIXME:
	const [isReceiveEmail, setIsReceiveEmail] = useLocalStorage(
		"@insty-app.receive.email",
		false,
	);

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		setIsReceiveEmail(e.target.checked);
	};

	return (
		<div className="w-full flex flex-col gap-10">
			<h3 className="text-2xl">이메일 수신 여부</h3>
			<div className="flex gap-10 w-full justify-between items-center">
				<span className="text-xl">
					앞으로 업데이트 소식이나 유용한 자료들을 이메일로 받아보시겠어요?
				</span>
				<Switch
					isChecked={isReceiveEmail}
					onChange={onChange}
					sx={{
						".chakra-switch__track": {
							backgroundColor: isReceiveEmail ? "#3C4A7E" : "#DEDEDE",
						},
						".chakra-switch__thumb": {
							backgroundColor: "#ffffff",
						},
					}}
				/>
			</div>
		</div>
	);
}

export default MyPageSetting;
