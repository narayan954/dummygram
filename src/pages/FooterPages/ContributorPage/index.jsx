import { Box, Typography, useMediaQuery } from '@mui/material';
import React, { useEffect, useState } from 'react';
import '../design.css';
import ContributorCard from './ContributorCard';
import './index.css';


function Contributor() {

    const [contributors, setContributors] = useState([]);
    const isNonMobileScreen = useMediaQuery("(max-width: 800px)");

    const getData = async () => {
        const res = await fetch('https://api.github.com/repos/narayan954/dummygram/contributors?per_page=100');
        const data = await res.json();
        const contributorsData = data.filter(
            (contributor) => !contributor.login.includes('dependabot[bot]')
        );
        setContributors(contributorsData);
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div className="contributor-container footer-page-para-color">
            <div className="contributor-sub-container">
                <span className="grad1 grad"></span>
                <span className="grad2 grad"></span>
                <span className="grad3 grad"></span>
                <span className="grad4 grad"></span>
                <span className="grad5 grad"></span>
                <span className="grad6 grad"></span>
                <span className="grad7 grad"></span>
                <span className="grad8 grad"></span>
                <span className="grad9 grad"></span>
                <span className="grad10 grad"></span>
                <span className="grad11 grad"></span>
                <span className="grad12 grad"></span>
                <div className="contributor-section glassmorphism-effect">
                    <Box margin={isNonMobileScreen ? "1rem 3rem" : "1rem 3rem"} position="relative">
                        <Typography textAlign="center" fontFamily="serif" fontSize="3.2rem" fontWeight="600" m="6rem 0 2rem 0">Our Contributors</Typography>
                        <Box sx={{ width: "100%", display: "flex", flexWrap: "wrap", rowGap: "2rem", justifyContent: "space-around" }}>
                            {contributors.map((contributor) =>
                                <ContributorCard
                                    key={contributor.id}
                                    image={contributor.avatar_url}
                                    title={contributor.login}
                                    commits={contributor.contributions}
                                    profile={contributor.html_url}
                                />
                            )}
                        </Box>
                    </Box>
                </div>
            </div>
        </div>
    )
}

export default Contributor;