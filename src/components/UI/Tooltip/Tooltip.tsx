import Tooltip from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import StyledEngineProvider from "@mui/material/StyledEngineProvider";

import './Tooltip.module.css';

const CustomizedTooltip = styled(Tooltip)`
    background:#000000;

    & .MuiTooltip-touch{
        background:#000;
    }
    & .MuiTooltip-tooltip{
        background:#000;
        padding:20px;
    }
    .MuiTooltip-popper .MuiTooltip-tooltip{
        padding:20px;
    }
    .MuiTooltip-popper{
        background:#000
    }
`;


function TurbosTooltip() {
    return (
        <StyledEngineProvider injectFirst>

            <Tooltip title="The position will be opened at 12.33 USD with a max slippage of 0.30%.The slippage amount can be configured under Settings, found by clicking on your address at the top right of the page after connecting your wallet.">
                <span>available</span>
            </Tooltip>

            <CustomizedTooltip title="The position will be opened at 12.33 USD with a max slippage of 0.30%.The slippage amount can be configured under Settings, found by clicking on your address at the top right of the page after connecting your wallet.">
                <span>nihao</span>
            </CustomizedTooltip>

        </StyledEngineProvider>
    )
}

export default TurbosTooltip;