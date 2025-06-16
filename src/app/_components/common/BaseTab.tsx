"use client";

import {
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	TabProps,
	Tabs,
	TabsProps,
} from "@chakra-ui/react";

type BaseTabItem = {
	label: string;
	content: React.ReactNode;
};

interface BaseTabProps extends Omit<TabsProps, "children"> {
	items: BaseTabItem[];
	defaultIndex?: number;
	tabProps?: TabProps;
}

function BaseTab({ items, defaultIndex = 0, tabProps, ...rest }: BaseTabProps) {
	return (
		<Tabs defaultIndex={defaultIndex} {...rest} mt={4}>
			<TabList borderBottom="none" mb={10}>
				{items.map((item, idx) => (
					<Tab
						cursor="pointer"
						_active={{ background: "none" }}
						key={idx}
						{...tabProps}
						display="inline-flex"
						flex="none"
						borderBottomWidth="2px"
						borderBottomColor="transparent"
						_selected={{
							color: "#479B5D",
							fontWeight: "bold",
							borderBottomColor: "#479B5D",
						}}
						_hover={{
							color: "#72C380",
							fontWeight: "semibold",
						}}
					>
						{item.label}
					</Tab>
				))}
			</TabList>
			<TabPanels>
				{items.map((item, idx) => (
					<TabPanel key={idx}>{item.content}</TabPanel>
				))}
			</TabPanels>
		</Tabs>
	);
}

export default BaseTab;
