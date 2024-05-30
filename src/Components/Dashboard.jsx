import React, { useEffect, useState } from 'react';
import { Bar, Line, Scatter, Bubble } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, } from 'chart.js';
import './Dashboard.css';
import axios from "axios"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const data = {
    IntensityLevelChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'temp',
                data: [85, 82, 80, 78, 75, 73, 70, 68],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    },
    topicBySectorChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'temp',
                data: [85, 82, 80, 78, 75, 73, 70, 68],
                borderColor: 'rgba(255, 99, 132, 1)',
                fill: false,
            },
        ],
    },
    SectorWiseIntensityChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'temp',
                data: [500, 600, 4897, 800, 900, 1200, 1400, 1600],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    },
    IntensityOverTimeChart: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'temp',
                data: [50, 55, 60, 52, 48, 51, 53, 55],
                borderColor: 'rgba(54, 162, 235, 1)',
                fill: false,
            },
        ],
    },
    DifferentLikelihood: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
        datasets: [
            {
                label: 'temp',
                data: [500, 600, 4897, 800, 900, 1200, 1400, 1600],
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
            },
        ],
    },
};

const Dashboard = () => {

    const [lineChart, setLineChart] = useState(data.IntensityLevelChart);
    const [year, setYear] = useState("2016-2020");
    const [impactAndTopic, setImpactAndTopic] = useState(data.topicBySectorChart)
    const [sectorName, setSectorName] = useState("Information Technology")
    const [intensityOverTime, setIntensityOverTime] = useState(data.IntensityOverTimeChart)
    const [sectorWiseIntensity, setSectorWiseIntensity] = useState(data.SectorWiseIntensityChart)
    const [differentLikelihood, setDifferentLikelihood] = useState(data.DifferentLikelihood)
    const [sector, setSector] = useState([])

    const handleChangeForLineChart = (event) => {
        setYear(event.target.value);
    }

    const handleChangeForImpactAndTopic = (event) => {
        setSectorName(event.target.value)
    }

    useEffect(() => {
        const intensityLevelByYear = async () => {
            try {
                const finalYear = year.split("-");
                const startYear = finalYear[0];
                const endYear = finalYear[1];

                const response = await axios.get(`http://localhost:8080/sector-intensity/${startYear}/${endYear}`)
                setLineChart({
                    labels: response.data.map(item => item.sector == "" ? "Empty" : item.sector),
                    datasets: [
                        {
                            label: 'Intensity Level',
                            data: response.data.map(item => item.intensity),
                            borderColor: '#00FFFF',
                            backgroundColor: '#00FFFF',
                            fill: false,
                        },
                    ],
                })

            } catch (error) {
                console.log(error);
            }
        }

        const sectorList = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/sectors`)
                setSector(response.data)
            } catch (error) {
                console.log(error);
            }
        }

        const impactByTopics = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/impact-topic/${sectorName}`)
                setImpactAndTopic({
                    labels: response.data.map(item => item.topic),
                    datasets: [
                        {
                            label: 'impactlevel',
                            data: response.data.map(item => item.impactLevel),
                            borderColor: 'rgba(255, 99, 132, 1)',
                            fill: false,
                        },
                    ],
                })
            } catch (error) {
                console.log(error);
            }
        }

        const fetchIntensityOverTime = async () => {
            try {

                const response = await axios.get("http://localhost:8080/intensity-time")
                setIntensityOverTime({
                    labels: response.data.map(item => item.end_year),
                    datasets: [
                        {
                            label: 'Intensity',
                            data: response.data.map(item => item.intensity),
                            borderColor: 'rgba(54, 162, 235, 1)',
                            fill: false,
                        },
                    ],
                })
            } catch (error) {
                console.log(error);
            }
        }

        const fetchSectorWiseIntensity = async () => {
            try {

                const response = await axios.get("http://localhost:8080/sectorWise")
                setSectorWiseIntensity({
                    labels: response.data.map(item => item.sector),
                    datasets: [
                        {
                            label: 'Intensity',
                            data: response.data.map(item => item.avgOfIntensity),
                            backgroundColor: 'rgba(153, 102, 255, 0.6)',
                        },
                    ],
                })
            } catch (error) {
                console.log(error);
            }
        }

        const fetchDifferentLikelihood = async () => {
            try {

                const response = await axios.get("http://localhost:8080/different-likelihood")
                setDifferentLikelihood({
                    labels: response.data.map(item => item.topic),
                    datasets: [
                        {
                            label: 'likelihood',
                            data: response.data.map(item => item.averageOfLikelihood),
                            backgroundColor: 'rgb(6,57,112)',
                        },  
                    ],
                })
            } catch (error) {
                console.log(error);
            }
        }

        fetchDifferentLikelihood();
        fetchSectorWiseIntensity();
        fetchIntensityOverTime();
        sectorList();
        intensityLevelByYear();
        impactByTopics();
    }, [year, sectorName])

    return (
        <div className="dashboard">
            <div className="card">
                <select className='dropdown' onChange={handleChangeForLineChart} >
                    <option>1986-1990</option>
                    <option>1991-1995</option>
                    <option>1996-2000</option>
                    <option>2001-2005</option>
                    <option>2006-2010</option>
                    <option>2011-2015</option>
                    <option>2016-2020</option>
                    <option>2021-2025</option>
                    <option>2026-2030</option>
                    <option>2031-2035</option>
                    <option>2035-2040</option>
                </select>
                <h3>Intensity Level By Sector</h3>
                <Bar data={lineChart} />
            </div>
            <div className="card">
                <select className='dropdown' onChange={handleChangeForImpactAndTopic}>
                    {sector.map((item, index) => (
                        <option key={index} value={item}>{item}</option>
                    ))}
                </select>
                <h3>Topic With ImpactLevel By Sector</h3>
                <Line data={impactAndTopic} />
            </div>
            <div className="card">
                <h3>Sector-wise Intensity Distribution</h3>
                <Bar data={sectorWiseIntensity} />
            </div>
            <div className="card">
                <h3>Trend of Intensity Over Time</h3>
                <Line data={intensityOverTime} />
            </div>
            <div className="card row-container">
                <h3>Different Likelihood</h3>
                <Bar data={differentLikelihood} />
            </div>
        </div>
    );
};

export default Dashboard;
