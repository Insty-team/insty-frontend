"use client";

import { Switch } from "@chakra-ui/react";
import { ChangeEvent } from "react";

import { usePatchUserEmailAgreeMutation } from "@/app/queries";
import { useAgreeEmail } from "@/app/utils";

function MyPageSetting() {
	const [isAgreeEmail] = useAgreeEmail();

	const { mutate: patchUserEmail } = usePatchUserEmailAgreeMutation();

	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		patchUserEmail(e.target.checked);
	};

	return (
		<div className="w-full flex flex-col gap-10">
			<h3 className="text-2xl">이메일 수신 여부</h3>
			<div className="flex gap-10 w-full justify-between items-center">
				<span className="text-xl">
					앞으로 업데이트 소식이나 유용한 자료들을 이메일로 받아보시겠어요?
				</span>
				<Switch
					isChecked={isAgreeEmail}
					onChange={onChange}
					sx={{
						".chakra-switch__track": {
							backgroundColor: isAgreeEmail ? "#6EAD79" : "#DEDEDE",
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
