import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserContext } from '../UserContext';
import { Confirm } from '../components/Confirm';
import Alerts from '../components/Alerts';
import {InviteHousehold , Modal2}  from './InviteHousehold'

import { UserType, ItemType } from '../types';

import { Line, Pie, Doughnut, Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, 
  PieController, ArcElement, Tooltip, Legend, 
  BarElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretUp, faCrown } from '@fortawesome/free-solid-svg-icons';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, 
  PieController, ArcElement, Tooltip, Legend,
  BarElement);

export default function Home() {
  const { householdId } = useParams();
  const navigate = useNavigate();

  // Get the state passed from context
  const { user, updateUser } = useUserContext();
  const userId = user?.id;

  // Household info variables
  const [ householdName, setHouseholdName ] = useState("");
  const [ householdMembers, setHouseholdMembers ] = useState<UserType[]>([]);
  const [ purchaseHistory, setPurchaseHistory ] = useState<ItemType[]>([]);
  const [ historyDisplayedLength, setHistoryDisplayedLength ] = useState(0);
  const [ totalExpenses, setTotalExpenses ] = useState<string>("0");
  const [ householdAge, setHouseholdAge ] = useState(100);
  const [ avgExpenditure, setAvgExpenditure ] = useState(100);

  // Chart data
  const [ expenditurePerMonthData, setExpenditurePerMonthData ] = useState<any>();
  const [ expensesByCategory, setExpensesByCategory ] = useState<any>();
  const [ expensesByItem, setExpensesByItem ] = useState<any>();
  const [ frequenciesByItem, setFrequenciesByItem ] = useState<any>();
  const [ numBarsDisplayed ] = useState(15);

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
        setHouseholdName(data.name);
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
        setHouseholdMembers(data);
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
        setPurchaseHistory(parsedData);
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
        console.log("Failed to fetch expenses per month")
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
        setExpensesByCategory({
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
        console.log("Failed to fetch expenses by category")
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
        
        console.log(data.expenses.labels)
        console.log(data.expenses.data)
        console.log(data.frequencies.labels)
        console.log(data.frequencies.data)

        // Intialize expenses chart data
        setExpensesByItem({
          labels: data.expenses.labels.slice(0, numBarsDisplayed), 
          datasets: [
            {
              label: "Expenditure",
              data: data.expenses.data.slice(0, numBarsDisplayed),
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

        // Intialize frequencies chart data
        setFrequenciesByItem({
          labels: data.frequencies.labels.slice(0, numBarsDisplayed), 
          datasets: [
            {
              label: "Expenditure",
              data: data.frequencies.data.slice(0, numBarsDisplayed),
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
        console.log("Failed to fetch expenses by item")
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
    // Set history displayed length
    setHistoryDisplayedLength((purchaseHistory.length >= 10) ? 10 : purchaseHistory.length);

    // Calculate total expenses
    let expenses = purchaseHistory.reduce((sum, item) => sum + (item.cost || 0), 0);
    setTotalExpenses((expenses / 100).toFixed(2));

    // Calculate household age
    if (purchaseHistory[0]) {
      const creationDate = purchaseHistory[0].purchaseDate;
      const currentDate = new Date(); // Current date

      // Calculate the difference in time (milliseconds)
      const differenceInMilliseconds = currentDate.getTime() - creationDate.getTime();

      // Convert the difference to days
      const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
      setHouseholdAge(differenceInDays);
    }
  }, [purchaseHistory]);

  // Update avg expenditure when per month data fetched
  useEffect(() => {
    setAvgExpenditure(Number(totalExpenses) / expenditurePerMonthData?.labels.length);
  }, [expenditurePerMonthData]);

  if (!(householdName && householdMembers && purchaseHistory && expenditurePerMonthData)) {
    return (
      <div>Loading...</div>
    );
  }

  return (
    <div className="">
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
        <div>
          Since {purchaseHistory[0]?.purchaseDate.toLocaleDateString('en-US', {timeZone: 'UTC'})}
        </div>
        <div>
          Over the course of: {householdAge} days
        </div>
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

      {/* Purchase History and Stats */}
      
      {purchaseHistory.length > 0 &&
        <div>
          {(expenditurePerMonthData && expenditurePerMonthData.labels.length > 1) && 
            <div className="w-fit flex flex-col">
              <div>Expenses Over Time</div>
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
            </div>
          }
          <div className="w-fit flex flex-col">
            <div>Expenses By Category</div>
            {expensesByCategory ? 
              <div className="w-[300px] h-[300px]">
                <Doughnut
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
                            return `$${Number(value).toFixed(2)} (${(value / Number(totalExpenses) * 100).toFixed(2)}%)`; // currency format
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
            <div>Top {numBarsDisplayed} Expenses By Item</div>
            {expensesByItem ? 
              <div className="w-[400px] h-[300px]">
                <Bar
                  data={expensesByItem}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Expenses By Item"
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
            <div>Top {numBarsDisplayed} Most Purchased Items</div>
            {frequenciesByItem ? 
              <div className="w-[1000px] h-[300px]">
                <Bar
                  data={frequenciesByItem}
                  options={{
                    plugins: {
                      title: {
                        display: true,
                        text: "Expenses By Item"
                      },
                      legend: {
                        display: false
                      },
                      tooltip: {
                        callbacks: {
                          label: function (context) {
                            const value = context.raw as number; // get raw value
                            return `${value} purchases`; // currency format
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

          <div className="w-full bg-black p-10 px-12 text-white rounded">
            <h1 className="font-bold text-xl mb-8">Purchase History</h1>
            <div className="w-full flex flex-col gap-2">
              {[...purchaseHistory].reverse().slice(0, historyDisplayedLength).map((item, i) => (
                <div className="w-full flex gap-2 justify-between items-center pb-2 border-solid border-neutral-400 border-b-[1px]"
                    key={i}>
                  <div className="min-w-[260px] font-semibold flex gap-4 justify-start items-center">
                    <div>
                      {item.name}
                    </div>
                    <div className="w-fit bg-light text-black text-sm p-1 py-0 rounded-full">
                      ${Number(item.cost / 100).toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-navy text-white text-sm font-medium p-1 py-0 rounded">
                    {item.purchaseDate.toLocaleDateString('en-US', {timeZone: 'UTC'})}
                  </div>
                  <div className="min-w-[400px] flex gap-1 justify-end">
                    <div className="flex gap-1 items-center text-green-300 font-medium">
                      <FontAwesomeIcon icon={faCrown} className="fa-regular text-xs" />
                      {item.purchasedBy.username}
                    </div>
                    <div className="flex">
                      {item.sharedBetween.map((user, i) => (
                        user.username !== item.purchasedBy.username ? 
                          <div className="mr-2"
                              key={i}>
                            {user.username}
                          </div>
                        :
                          <div></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {purchaseHistory.length > 10 &&
              <button className="p-2 pt-1 mt-4 font-bold border-solid border-gray-300 border-2 rounded"
                onClick={() => {
                  if (historyDisplayedLength < purchaseHistory.length) {
                    setHistoryDisplayedLength(purchaseHistory.length);
                  } else {
                    setHistoryDisplayedLength(10);
                  }
                }}
              >
                {historyDisplayedLength < purchaseHistory.length?
                  <span className="flex items-center gap-2 ">
                    <div>See More</div>
                    <FontAwesomeIcon icon={faCaretDown} className="fa-regular text-lg" />
                  </span>
                :
                <span className="flex items-center gap-2 ">
                  <div>See Less</div>
                  <FontAwesomeIcon icon={faCaretUp} className="fa-regular text-lg" />
                </span>
                }
              </button>
            }
          </div>
        </div>
      }
    </div>
  );
}