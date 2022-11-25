import Tooltip, { tooltipClasses, TooltipProps } from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';

const CustomizedTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
))({
    [`& .${tooltipClasses.tooltip}`]: {
        maxWidth: 500,
        background: 'rgba(40,51,62,0.98)',
        boxShadow: '0px 0px 20px 0px rgba(0,0,0,0.3)',
        borderRadius: '5px',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '20px',
        margin: '0'
    },
});

type TurbosTooltipProps = {
    children: React.ReactElement<any, any>,
    title: React.ReactNode
}
function TurbosTooltip(props: TurbosTooltipProps) {
    const { children, title } = props;
    return (
        <CustomizedTooltip title={title} placement="bottom-end">
            {children}
        </CustomizedTooltip>
    )
}

export default TurbosTooltip;