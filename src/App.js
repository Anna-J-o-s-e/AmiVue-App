import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './components/LandingPage';
// import Login from './components/Login';
import UserSignUp from './components/UserSignUp';
import ProfessionalSignUp from './components/ProffessionalSignUp';
import ForgotPassword from './components/ForgotPassword';
import UserDashboard from './components/UserDashboard';
import ProffessionalDashboard from './components/ProffessionalDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserLogin from './components/UserLogin';
import UserProfile from './components/UserProfile';
import ProfessionalsList from './components/ProfessionalsList';
import Chat from './components/Chat';
import ChatList from './components/ChatList';
import Simulation from './components/Simulation';
import ProfessionalProfile from './components/ProfessionalProfile';
import ProfessionalChatList from './components/ProfessionalChatList';
import ProfessionalChat from './components/ProfessionalChat';
import TakeATest from './components/TakeATest';
import VisualAcuityTest from './components/VisualAcuityTest';
import VisualAcuityAnalysis from './components/VisualAcuityAnalysis';
import UserData from './components/UserData';



function App() {
  return (
    <div>
    <BrowserRouter><Routes>
      
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/login" element={<UserLogin/>}/>
      <Route path="/usersignup" element={<UserSignUp/>}/>
      <Route path="/proffessionalsignup" element={<ProfessionalSignUp/>}/>
      <Route path="/forgotpassword" element={<ForgotPassword/>}/>
      <Route path="/userdashboard" element={<UserDashboard/>}/>
      <Route path="/professionaldashboard" element={<ProffessionalDashboard/>}/>
      <Route path="/admindashboard" element={<AdminDashboard/>}/>
      <Route path='/userprofile' element={<UserProfile/>}/>
      <Route path='/professionalslist' element={<ProfessionalsList/>}/>
      <Route path="/chat/:professionalId" element={<Chat />} />
      <Route path="/chatlist" element={<ChatList/>} />
      <Route path="/simulation" element={<Simulation/>} />
      <Route path="/professionalprofile" element={<ProfessionalProfile/>}/>
      <Route path='/professionalchatlist' element={<ProfessionalChatList/>}/>
      <Route path="/professional-chat/:userId" element={<ProfessionalChat/>} />
      <Route path="/takeatest" element={<TakeATest/>} />
      <Route path="/visualacuitytest" element={<VisualAcuityTest/>} />
      <Route path="/visualacuityanalysis" element={<VisualAcuityAnalysis/>} />
      <Route path='/userdata' element={<UserData/>}/>
      </Routes></BrowserRouter>
      {/* <ProfessionalSignUp/> */}
      {/* <Chat/> */}
    </div>
  );
}

export default App;
