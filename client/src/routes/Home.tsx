import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';
import { Confirm } from '../components/Confirm';
import Alerts from '../components/Alerts';
import {InviteHousehold , Modal2}  from './InviteHousehold'

import { UserType, ItemType } from '../types';

import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, 
  PieController, ArcElement, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, 
  PieController, ArcElement, Tooltip, Legend);

export default function Home() {
  const { householdId } = useParams();
  const navigate = useNavigate();

  // Get the state passed from context
  const { user, updateUser } = useUserContext();
  const userId = user?.id;

  // Household info variables
  const [ householdName, updateHouseholdName ] = useState("");
  const [ householdMembers, updateHouseholdMembers ] = useState<UserType[]>([]);
  const [ purchaseHistory, updatePurchaseHistory ] = useState<ItemType[]>([]);
  const [ totalExpenses, updateTotalExpenses ] = useState<string>("0");
  const [ householdAge, updateHouseholdAge ] = useState(100);
  const [ avgExpenditure, updateAvgExpenditure ] = useState(100);

  // Chart data
  const [ expenditurePerMonthData, setExpenditurePerMonthData ] = useState<any>();
  const [ expensesByCategory, setexpensesByCategory ] = useState<any>();
  const [ expensesByItem, setexpensesByItem ] = useState<any>();

  // Toggle confirmation modal for account deletion
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const openModal = () => setShowConfirmDelete(true);
  const closeModal = () => setShowConfirmDelete(false);

  // Modal for Invite Household
  const [showInviteHousehold, setInviteHousehold] = useState(false);
  // Function to open the modal
  const openModal2 = () => setInviteHousehold(true);
  // Function to close the modal
  const closeModal2 = () => setInviteHousehold(false);

  const getHouseholdInfo = async () => {
    // Get household name
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        updateHouseholdName(data.name);
      } else {
        console.log("Failed to fetch household info")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    // Get household members
    try {
      const url = `http://localhost:6969/household/members/${householdId}`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        updateHouseholdMembers(data);
      } else {
        console.log("Failed to fetch household info")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  const handleLeave = async () => {
    try {
      // Define the URL with householdId as a path parameter
      const url = `http://localhost:6969/household/leave/${householdId}`;

      // Create the POST request with userId in the body
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Pass userId in the request body
      });

      if (response.ok) {
        // alert(`User ${userId} left household successfully`)
        updateUser();
        navigate('/profile');
      } else {
        alert(`Failed to leave household`)
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  const getPurchaseHistory = async () => {
    // Get purchase history
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/purchaseHistory`;
      const response = await fetch(url);
      const data = await response.json();
      if (response.ok) {
        // Parse purchaseDate into Date objects
        const parsedData = data.map((item: ItemType) => ({
          ...item,
          purchaseDate: new Date(item.purchaseDate),
        }));
        updatePurchaseHistory(parsedData);
        console.log(parsedData);
      } else {
        console.log("Failed to fetch purchase history")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    /* Get chart data */

    // Expenditure per month
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/expenditurePerMonth`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        
        console.log(data.labels)
        console.log(data.data)

        // Intialize chart data
        setExpenditurePerMonthData({
          labels: data.labels, 
          datasets: [
            {
              label: "Expenditure",
              data: data.data,
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0"
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        });
      } else {
        console.log("Failed to fetch purchase history")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    // Expenses by category
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/expensesByCategory`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        
        console.log(data.labels)
        console.log(data.data)

        // Intialize chart data
        setexpensesByCategory({
          labels: data.labels, 
          datasets: [
            {
              label: "Expenditure",
              data: data.data,
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#2a71d0",
                "#325374",
                "#f3ba2f",
                "#f28482",
                "#96c7bbad",
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        });
      } else {
        console.log("Failed to fetch purchase history")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }

    // Expenses by item
    try {
      // GET request to server
      const url = `http://localhost:6969/household/${householdId}/expensesByItem`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        
        console.log(data.labels)
        console.log(data.data)

        // Intialize chart data
        setexpensesByCategory({
          labels: data.labels, 
          datasets: [
            {
              label: "Expenditure",
              data: data.data,
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#ecf0f1",
                "#2a71d0",
                "#325374",
                "#f3ba2f",
                "#f28482",
                "#96c7bbad",
              ],
              borderColor: "black",
              borderWidth: 2
            }
          ]
        });
      } else {
        console.log("Failed to fetch purchase history")
      }
    } catch (error) {
      console.error('Error making request:', error);
    }
  };

  useEffect(() => {
    getHouseholdInfo();
    getPurchaseHistory();
  }, [householdId]);

  // Update when purchase history fetched
  useEffect(() => {
    let expenses = purchaseHistory.reduce((sum, item) => sum + (item.cost || 0), 0);
    updateTotalExpenses((expenses / 100).toFixed(2));
    if (purchaseHistory[0]) {
      const creationDate = purchaseHistory[0].purchaseDate;
      const currentDate = new Date(); // Current date

      // Calculate the difference in time (milliseconds)
      const differenceInMilliseconds = currentDate.getTime() - creationDate.getTime();

      // Convert the difference to days
      const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      updateHouseholdAge(differenceInDays);
    }
  }, [purchaseHistory]);

  // Update avg expenditure when per month data fetched
  useEffect(() => {
    updateAvgExpenditure(Number(totalExpenses) / expenditurePerMonthData?.labels.length);
  }, [expenditurePerMonthData]);

  if (!(householdName && householdMembers && purchaseHistory && expenditurePerMonthData)) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div>
      <Alerts />
      <h1 className="text-xl font-bold">{householdName}</h1>
      <h1>Aggregate data:</h1>
      <div>
        <div>
          Total number of items purchased: {purchaseHistory.length}
        </div>
        <div>
          Total amount spent: ${totalExpenses}
        </div>
        <div>
          Average expenditure per month: ${avgExpenditure}
        </div>
        {/*<div>
          Since {purchaseHistory[0]?.purchaseDate.toLocaleDateString('en-US', {timeZone: 'UTC'})}
        </div>
        <div>
          Over the course of: {householdAge} days
        </div>*/}
      </div>
      <h1>Members:</h1>
      <div>
        {householdMembers.map((member, i) => (
          <div key={i}>
            <div>{member.username} | {member.email}</div>
          </div>
        ))}
      </div>
      <br></br>
      {/* Leave Household */}
      <div className="input-group">
        <button className="label-button submit-button" onClick={openModal}>
          Leave Household
        </button>
        <Confirm
          show={showConfirmDelete}
          onClose={closeModal}
          onConfirm={handleLeave}
          message="Are you sure you want to leave this household?">
        </Confirm>

        <div>
          <button 
            className="label-button submit-button"
              onClick={openModal2}>
            Invite User
          </button>
          <Modal2 show={showInviteHousehold} onClose={closeModal2}>
            <InviteHousehold onClose={closeModal2} householdId={householdId}/> 
          </Modal2>
          <br></br>
          <br></br>
        </div> 
      </div>

      <div className="w-fit flex flex-col">
        <div>Expenses Over Time</div>
        {expenditurePerMonthData ? 
          <div className="w-[500px] h-[200px]">
            <Line
              data={expenditurePerMonthData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Expenditure Over Time"
                  },
                  legend: {
                    display: false
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.raw as number; // get raw value
                        return `$${Number(value).toFixed(2)}`; // currency format
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: function (value) {
                        return `$${Number(value).toFixed(2)}`; // currency format
                      }
                    }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        :
          <div>Loading...</div>
        }
      </div>
      <div className="w-fit flex flex-col">
        <div>Expenses By Category</div>
        {expensesByCategory ? 
          <div className="w-[300px] h-[300px]">
            <Pie
              data={expensesByCategory}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: "Expenses By Category"
                  },
                  legend: {
                    display: true
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        const value = context.raw as number; // get raw value
                        return `$${Number(value).toFixed(2)}`; // currency format
                      }
                    }
                  }
                },
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        :
          <div>Loading...</div>
        }
      </div>

      <div>
        <h1>Entire purchase history</h1>
        <div className="flex flex-col gap-2">
          {[...purchaseHistory].reverse().map((item, i) => (
            <div className="flex gap-2 items-center pb-2 border-solid border-black border-b-2"
                key={i}>
              <div>
                {item.name}
              </div>
              <div className="w-fit bg-navy text-white p-2 py-1 rounded">
                ${Number(item.cost / 100).toFixed(2)}
              </div>
              <div>
                {item.purchaseDate.toLocaleDateString('en-US', {timeZone: 'UTC'})}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}